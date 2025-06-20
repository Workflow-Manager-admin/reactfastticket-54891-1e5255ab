import React, { createContext, useContext, useReducer, useEffect } from "react";

// PUBLIC_INTERFACE
// AuthContext for global authentication state management
const AuthContext = createContext();

const initialState = {
  user: null,
  loading: true,
  token: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.user, token: action.token, loading: false };
    case "LOGOUT":
      return { ...state, user: null, token: null, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On mount, rehydrate from localStorage if possible
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const user = localStorage.getItem("user");
    if (token && user) {
      dispatch({ type: "LOGIN", token, user: JSON.parse(user) });
    } else {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  }, []);

  // PUBLIC_INTERFACE
  const login = (user, token) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "LOGIN", user, token });
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export const useAuth = () => useContext(AuthContext);
