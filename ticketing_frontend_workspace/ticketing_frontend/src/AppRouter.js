import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import TicketsPage from "./pages/TicketsPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import TicketCreatePage from "./pages/TicketCreatePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuth } from "./context/AuthContext";

// PUBLIC_INTERFACE
function AppRouter() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<TicketsPage />} />
        <Route path="/tickets/new" element={user ? <TicketCreatePage /> : <Navigate to="/login" />} />
        <Route path="/tickets/:id" element={<TicketDetailPage />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
