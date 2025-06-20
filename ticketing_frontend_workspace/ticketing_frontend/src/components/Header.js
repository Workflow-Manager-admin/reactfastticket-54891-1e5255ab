import React from "react";
import { Link, useNavigate } from "react-router-dom";
import COLORS from "../theme";
import { useAuth } from "../context/AuthContext";

const styles = {
  header: {
    background: COLORS.primary,
    color: "#fff",
    padding: "0 32px",
    height: 58,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `2px solid ${COLORS.secondary}`,
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  nav: {
    display: "flex",
    gap: 24,
    alignItems: "center",
  },
  logo: {
    fontWeight: 600,
    fontSize: 20,
    letterSpacing: "1px",
    display: "flex",
    alignItems: "center",
  },
  button: {
    background: COLORS.accent,
    border: "none",
    color: "#152438",
    borderRadius: 4,
    padding: "7px 15px",
    fontWeight: 500,
    marginLeft: 12,
    cursor: "pointer",
  },
};

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <span style={{ color: COLORS.accent, fontWeight: 700, marginRight: 8 }}>*</span>
        Ticketing
      </div>
      <nav style={styles.nav}>
        <Link to="/">Tickets</Link>
        {user && <Link to="/tickets/new">New Ticket</Link>}
        {user && <Link to="/profile">Profile</Link>}
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && (
          <button
            style={styles.button}
            onClick={() => { logout(); navigate("/login"); }}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
