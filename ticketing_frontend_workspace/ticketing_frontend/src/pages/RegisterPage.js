import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import COLORS from "../theme";

// PUBLIC_INTERFACE
function RegisterPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const resp = await registerUser(form);
      login(resp.user, resp.access_token);
      navigate("/");
    } catch (err) {
      setError("Registration failed. Username/email may be taken.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: 380, margin: "60px auto", background: "#fff", borderRadius:7, padding: "28px 32px", boxShadow: "0 1px 6px #e0e5ef"
    }}>
      <h2 style={{ color: COLORS.primary }}>Sign Up</h2>
      <div>
        <label>Username</label>
        <input name="username" required value={form.username} onChange={handleChange} style={{width:"100%",marginBottom:14}} autoComplete="username" />
      </div>
      <div>
        <label>Email</label>
        <input name="email" type="email" required value={form.email} onChange={handleChange} style={{width:"100%",marginBottom:14}} autoComplete="email" />
      </div>
      <div>
        <label>Password</label>
        <input name="password" type="password" required value={form.password} onChange={handleChange} style={{width:"100%",marginBottom:14}} autoComplete="new-password"/>
      </div>
      {error && <div style={{ color: COLORS.accent, marginBottom: 12 }}>{error}</div>}
      <button type="submit" disabled={loading} style={{
        background: COLORS.primary, color: "#fff", padding: "9px 18px", border: "none",
        borderRadius: 4, fontWeight: 500, width:"100%", cursor: "pointer"
      }}>
        {loading ? "Creating account..." : "Register"}
      </button>
    </form>
  );
}
export default RegisterPage;
