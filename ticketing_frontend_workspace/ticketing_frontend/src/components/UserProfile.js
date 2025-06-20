import React from "react";
import COLORS from "../theme";

// PUBLIC_INTERFACE
function UserProfile({ user }) {
  if (!user) return <div style={{ padding:20 }}>No profile loaded.</div>;

  return (
    <div style={{
      maxWidth: 420, margin: "50px auto", background: "#fff", borderRadius: 8,
      padding: "32px 28px", color: COLORS.text, boxShadow: "0 1px 5px #e1e4ea"
    }}>
      <h2 style={{ color: COLORS.primary, marginBottom:5 }}>User Profile</h2>
      <div><strong>Name:</strong> {user?.full_name || user?.username}</div>
      <div><strong>Email:</strong> {user?.email}</div>
      <div><strong>Role:</strong> {user?.role || "user"}</div>
    </div>
  );
}
export default UserProfile;
