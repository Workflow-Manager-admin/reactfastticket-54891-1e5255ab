import React, { useState } from "react";
import { createTicket } from "../api/tickets";
import { useNavigate } from "react-router-dom";
import TicketForm from "../components/TicketForm";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
function TicketCreatePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  async function handleCreate(data) {
    setLoading(true);
    setError("");
    try {
      await createTicket(data);
      navigate("/");
    } catch (e) {
      setError("Create failed");
    }
    setLoading(false);
  }

  if (!user) {
    return <div style={{ padding: 34 }}>You must be logged in to create a ticket.</div>
  }

  return <TicketForm onSubmit={handleCreate} loading={loading} error={error} />;
}
export default TicketCreatePage;
