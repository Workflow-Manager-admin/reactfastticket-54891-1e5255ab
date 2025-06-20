import React, { useEffect, useState } from "react";
import { fetchTickets } from "../api/tickets";
import TicketList from "../components/TicketList";
import Sidebar from "../components/Sidebar";
import COLORS from "../theme";

const defaultFilters = { status: "", priority: "" };

// PUBLIC_INTERFACE
function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    setLoading(true);
    let query = [];
    if (filters.status) query.push(`status=${filters.status}`);
    if (filters.priority) query.push(`priority=${filters.priority}`);
    fetchTickets(query.join("&"))
      .then(setTickets)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filters]);

  function onFilterChange(type, value) {
    setFilters(f => ({ ...f, [type]: f[type] === value ? "" : value }));
  }

  return (
    <div style={{ display: "flex", marginTop: 10 }}>
      <div>
        <Sidebar filters={filters} current={filters} onFilterChange={onFilterChange} />
      </div>
      <div style={{ flex: 1, minWidth:0, padding: "30px 36px" }}>
        <h1 style={{ color: COLORS.primary }}>Tickets</h1>
        <TicketList tickets={tickets} loading={loading} error={error} />
      </div>
    </div>
  );
}
export default TicketsPage;
