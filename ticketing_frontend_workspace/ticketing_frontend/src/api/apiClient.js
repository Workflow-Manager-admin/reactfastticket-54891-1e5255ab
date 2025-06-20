//
// Basic API client for RESTful operations
//
const API_BASE =
  process.env.REACT_APP_API_URL ||
  "http://localhost:3001"; // fallback for dev mode

const authHeader = () => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// PUBLIC_INTERFACE
export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...authHeader() },
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// PUBLIC_INTERFACE
export async function apiPost(path, data) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// PUBLIC_INTERFACE
export async function apiPut(path, data) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// PUBLIC_INTERFACE
export async function apiDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...authHeader() },
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
