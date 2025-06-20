import React from "react";
import COLORS from "../theme";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
function TicketList({ tickets, loading, error }) {
  if (loading) return <div style={{ padding: 20 }}>Loading tickets...</div>;
  if (error)
    return (
      <div style={{ padding: 20, color: COLORS.accent}}>
        Error: {error}
      </div>
    );
  if (!tickets?.length)
    return <div style={{ padding: 20, color: COLORS.secondary }}>No tickets found.</div>;

  return (
    <div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {tickets.map((ticket) => (
          <li
            key={ticket.id}
            style={{
              background: "#fff",
              color: COLORS.text,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 5,
              padding: 18,
              marginBottom: 18,
              boxShadow: "0 1px 5px 0 #e7e9f1",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div style={{display:"flex",alignItems: "center",justifyContent:"space-between"}}>
              <strong>
                <Link to={`/tickets/${ticket.id}`} style={{ color: COLORS.primary, textDecoration: "none"}}>
                  {ticket.title}
                </Link>
              </strong>
              <span style={{
                background: COLORS.accent, color: COLORS.secondary, fontWeight: 500,
                padding: "2px 10px", borderRadius: 4, fontSize: 13,
                marginRight: 4
              }}>{ticket.status}</span>
            </div>
            <div style={{ fontSize: 14, color: COLORS.secondary }}>
              {ticket.description?.slice(0,120)}
              {ticket.description && ticket.description.length > 120 && "..."}
            </div>
            <div style={{ display:"flex", gap:20, fontSize: 12, color: COLORS.primary }}>
              <span>Priority: {ticket.priority}</span>
              {ticket.assignee && <span>Assignee: {ticket.assignee}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TicketList;
