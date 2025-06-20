import React, { useState } from "react";
import COLORS from "../theme";

// PUBLIC_INTERFACE
function TicketForm({ initial = {}, onSubmit, loading, error, isEdit }) {
  const [form, setForm] = useState({
    title: initial.title || "",
    description: initial.description || "",
    priority: initial.priority || "medium",
    status: initial.status || "open",
    assignee: initial.assignee || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: "#fff",
      color: COLORS.text,
      padding: 24,
      borderRadius: 7,
      boxShadow: "0 1px 6px #e1e3e9",
      maxWidth: 480,
      margin: "40px auto"
    }}>
      <h2>{isEdit ? "Edit Ticket" : "New Ticket"}</h2>
      <div>
        <label>Title</label>
        <input name="title" required value={form.title} onChange={handleChange} style={{width:"100%", marginBottom:14}} />
      </div>
      <div>
        <label>Description</label>
        <textarea name="description" required rows={4} value={form.description} onChange={handleChange} style={{width:"100%", marginBottom:14}} />
      </div>
      <div>
        <label>Priority</label>
        <select name="priority" value={form.priority} onChange={handleChange} style={{marginBottom:10}}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label>Status</label>
        <select name="status" value={form.status} onChange={handleChange} style={{marginBottom:10}}>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      <div>
        <label>Assignee</label>
        <input name="assignee" value={form.assignee} onChange={handleChange} style={{width:"100%", marginBottom:14}} />
      </div>
      {error && <div style={{ color: COLORS.accent, marginBottom: 10 }}>{error}</div>}
      <button type="submit" style={{
        background: COLORS.primary, color: "#fff", padding: "8px 16px", border: "none", borderRadius: 4, fontWeight: 500, cursor: "pointer"
      }} disabled={loading}>
        {loading ? "Processing..." : isEdit ? "Save" : "Create Ticket"}
      </button>
    </form>
  );
}

export default TicketForm;
