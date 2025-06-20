import React from "react";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./AppRouter";

// PUBLIC_INTERFACE
function App() {
  // Glue the app-wide context and routing
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;