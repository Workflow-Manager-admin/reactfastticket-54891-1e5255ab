import React, { useEffect, useState } from "react";
import { fetchTicket, updateTicket, deleteTicket } from "../api/tickets";
import { useParams, useNavigate, Link } from "react-router-dom";
import TicketForm from "../components/TicketForm";
import COLORS from "../theme";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
function TicketDetailPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    fetchTicket(id)
      .then(setTicket)
      .catch((e) => setError("Error loading ticket."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave(data) {
    setProcessing(true);
    setError("");
    try {
      await updateTicket(id, data);
      setEditing(false);
      setTicket({ ...ticket, ...data });
    } catch (e) {
      setError("Update failed.");
    }
    setProcessing(false);
  }

  async function handleDelete() {
    if (!window.confirm("Delete this ticket?")) return;
    setProcessing(true);
    setError("");
    try {
      await deleteTicket(id);
      navigate("/");
    } catch (e) {
      setError("Delete failed.");
    }
    setProcessing(false);
  }

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (error) return <div style={{ padding: 40, color: COLORS.accent }}>{error}</div>;
  if (!ticket) return <div style={{ padding: 40 }}>No ticket found</div>;

  if (editing) {
    return <TicketForm initial={ticket} isEdit loading={processing} error={error} onSubmit={handleSave} />;
  }

  return (
    <div style={{
      maxWidth: 560, margin: "36px auto", background: "#fff", borderRadius: 6,
      boxShadow: "0 1px 7px #e0e2e9", color: COLORS.text, padding: "28px 32px"
    }}>
      <h2 style={{ color: COLORS.primary }}>{ticket.title}</h2>
      <div style={{ marginBottom:10, color: COLORS.secondary}}>{ticket.description}</div>
      <div style={{display:"flex", gap:32, fontSize:13}}>
        <span>Status: {ticket.status}</span>
        <span>Priority: {ticket.priority}</span>
        {ticket.assignee && <span>Assignee: {ticket.assignee}</span>}
      </div>
      <div style={{marginTop:22, display:"flex", gap:12}}>
        {user && (
          <>
            <button onClick={() => setEditing(true)} style={{
              background: COLORS.primary, color: "#fff", padding: "7px 12px",
              border: "none", borderRadius: 4, fontWeight: 500, cursor: "pointer"
            }}>Edit</button>
            <button onClick={handleDelete} style={{
              background: COLORS.accent, color: COLORS.secondary, padding: "7px 12px",
              border: "none", borderRadius: 4, fontWeight: 500, cursor: "pointer"
            }}>Delete</button>
          </>
        )}
        <Link to="/" style={{ color: COLORS.primary, marginLeft: "auto" }}>Back to list</Link>
      </div>
    </div>
  );
}

export default TicketDetailPage;
