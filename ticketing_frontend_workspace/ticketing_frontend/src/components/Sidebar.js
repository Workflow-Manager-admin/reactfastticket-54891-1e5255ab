import React from "react";
import COLORS from "../theme";

const styles = {
  sidebar: {
    background: COLORS.sidebarBG,
    borderRight: `1px solid ${COLORS.border}`,
    height: "100%",
    padding: "24px 16px",
    minWidth: 180,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 24,
    position: "sticky",
    top: 58,
  },
  groupTitle: {
    color: COLORS.primary,
    fontWeight: 600,
    marginBottom: 8,
    fontSize: 15,
  },
  filter: {
    fontWeight: 500,
    color: COLORS.secondary,
    margin: "3px 0",
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "left"
  }
};

// PUBLIC_INTERFACE
function Sidebar({ filters, onFilterChange, current }) {
  return (
    <aside style={styles.sidebar}>
      <div>
        <div style={styles.groupTitle}>Status</div>
        {["open", "in-progress", "closed"].map((status) => (
          <button
            key={status}
            style={styles.filter}
            onClick={() => onFilterChange("status", status)}
          >
            {status[0].toUpperCase() + status.slice(1)}
            {current.status === status && " ●"}
          </button>
        ))}
      </div>
      <div>
        <div style={styles.groupTitle}>Priority</div>
        {["low", "medium", "high"].map((priority) => (
          <button
            key={priority}
            style={styles.filter}
            onClick={() => onFilterChange("priority", priority)}
          >
            {priority[0].toUpperCase() + priority.slice(1)}
            {current.priority === priority && " ●"}
          </button>
        ))}
      </div>
      {/* Can extend with more filter groups (assignee, etc) */}
    </aside>
  );
}

export default Sidebar;
