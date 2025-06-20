"""
FastAPI backend for the Ticketing System.
Includes user registration, authentication, ticket and user profile management
with SQLite database. Properly structured code with routers for users and tickets,
JWT authentication, and database ORM via SQLAlchemy.
"""

from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import (
    create_engine, Column, Integer, String, Text,
    DateTime, ForeignKey
)
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
import os


# ----- CONFIG -----
DATABASE_URL = "sqlite:///./ticketing.db"
JWT_SECRET = os.environ.get(
    "JWT_SECRET",
    "DEVELOPMENT_SECRET_KEY"
)  # In production, use a strong secret!
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day


# ----- DATABASE SETUP -----
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


def get_db():
    """
    Dependency - provide a database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ----- PASSWORD HASHING -----
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


# ----- JWT TOKEN UTILS -----
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/users/login")


# ----- MODELS -----
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    tickets = relationship("Ticket", back_populates="owner")


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String, default="open", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="tickets")


# Create tables on startup if they do not exist
Base.metadata.create_all(bind=engine)

# ----- SCHEMAS/PYDANTIC MODELS -----


class UserRegister(BaseModel):
    email: EmailStr = Field(..., description="User email")
    password: str = Field(
        ..., min_length=6, description="Password (min 6 chars)"
    )
    full_name: Optional[str] = Field(default="", description="Full Name (optional)")


class UserProfile(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str]

    # PUBLIC_INTERFACE
    @classmethod
    def from_orm_user(cls, user: User):
        return cls(
            id=user.id,
            email=user.email,
            full_name=user.full_name
        )


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: int


class TicketCreate(BaseModel):
    title: str = Field(
        ..., min_length=1, max_length=200, description="Title of the ticket"
    )
    description: Optional[str] = Field("", description="Detailed description")


class TicketOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime
    user_id: int

    # PUBLIC_INTERFACE
    @classmethod
    def from_orm_ticket(cls, t: Ticket):
        return cls(
            id=t.id,
            title=t.title,
            description=t.description,
            status=t.status,
            created_at=t.created_at,
            updated_at=t.updated_at,
            user_id=t.user_id
        )


class TicketUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


# ----- DEPENDENCY: AUTH -----
# PUBLIC_INTERFACE
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Get the currently authenticated user from JWT token.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None or "user_id" not in payload:
        raise credentials_exception
    user = db.query(User).filter(User.id == payload["user_id"]).first()
    if user is None:
        raise credentials_exception
    return user


# ----- ROUTERS -----

# --- User Router ---
user_router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"]
)


@user_router.post(
    "/register",
    response_model=UserProfile,
    summary="User Registration",
    description="Register a new user account."
)
def register_user(
    data: UserRegister,
    db: Session = Depends(get_db)
):
    """
    Register a new user.
    """
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered.")
    user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserProfile.from_orm_user(user)


@user_router.post(
    "/login",
    response_model=Token,
    summary="User Login",
    description="Authenticate and get a JWT token."
)
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Authenticate user and return a JWT access token.
    """
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")
    access_token = create_access_token(data={"user_id": user.id})
    return Token(access_token=access_token)


@user_router.get(
    "/me",
    response_model=UserProfile,
    summary="View Profile",
    description="Retrieve the authenticated user's profile."
)
def get_profile(current_user: User = Depends(get_current_user)):
    """
    Get logged-in user's profile.
    """
    return UserProfile.from_orm_user(current_user)


@user_router.put(
    "/me",
    response_model=UserProfile,
    summary="Update Profile",
    description="Update the authenticated user's profile."
)
def update_profile(
    new_profile: UserRegister,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update user profile info.
    """
    current_user.full_name = new_profile.full_name
    if new_profile.password:
        current_user.hashed_password = hash_password(new_profile.password)
    db.commit()
    db.refresh(current_user)
    return UserProfile.from_orm_user(current_user)


# --- Ticket Router ---
ticket_router = APIRouter(
    prefix="/api/v1/tickets",
    tags=["Tickets"]
)


@ticket_router.post(
    "/",
    response_model=TicketOut,
    summary="Create Ticket",
    description="Create a new support ticket."
)
def create_ticket(
    ticket: TicketCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a ticket for the authenticated user.
    """
    new_ticket = Ticket(
        **ticket.dict(),
        status="open",
        user_id=current_user.id
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return TicketOut.from_orm_ticket(new_ticket)


@ticket_router.get(
    "/",
    response_model=List[TicketOut],
    summary="List Tickets",
    description="List tickets created by the authenticated user."
)
def list_tickets(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all tickets for current user.
    """
    tickets = (
        db.query(Ticket)
        .filter(Ticket.user_id == current_user.id)
        .order_by(Ticket.created_at.desc())
        .all()
    )
    return [TicketOut.from_orm_ticket(t) for t in tickets]


@ticket_router.get(
    "/{ticket_id}",
    response_model=TicketOut,
    summary="Get Ticket",
    description="Get a ticket by ID (must be owned by user)."
)
def get_ticket(
    ticket_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get ticket by id (must belong to user).
    """
    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.id == ticket_id,
            Ticket.user_id == current_user.id
        )
        .first()
    )
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found.")
    return TicketOut.from_orm_ticket(ticket)


@ticket_router.put(
    "/{ticket_id}",
    response_model=TicketOut,
    summary="Update Ticket",
    description="Update an existing ticket (must be owned by user)."
)
def update_ticket(
    ticket_id: int,
    update: TicketUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a ticket (title, description, status) if owned by user.
    """
    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.id == ticket_id,
            Ticket.user_id == current_user.id
        )
        .first()
    )
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found.")
    fields = update.dict(exclude_unset=True)
    for key, value in fields.items():
        setattr(ticket, key, value)
    db.commit()
    db.refresh(ticket)
    return TicketOut.from_orm_ticket(ticket)


@ticket_router.delete(
    "/{ticket_id}",
    status_code=204,
    summary="Delete Ticket",
    description="Delete a ticket (must be owned by user)."
)
def delete_ticket(
    ticket_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a ticket.
    """
    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.id == ticket_id,
            Ticket.user_id == current_user.id
        )
        .first()
    )
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found.")
    db.delete(ticket)
    db.commit()
    return


# ----- FASTAPI APP -----
app = FastAPI(
    title="Ticketing System API",
    description="RESTful backend for ticketing platform. Handles users, authentication, tickets.",
    version="1.0.0",
    openapi_tags=[
        {"name": "Users", "description": "User registration, login, profile"},
        {"name": "Tickets", "description": "Ticket creation, management and listing"},
    ]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(user_router)
app.include_router(ticket_router)


@app.get("/", tags=["Misc"])
def health_check():
    """Health check endpoint."""
    return {"message": "Healthy"}
