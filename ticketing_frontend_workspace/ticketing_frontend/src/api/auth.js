import { apiPost, apiGet } from "./apiClient";

// PUBLIC_INTERFACE
export async function loginUser(credentials) {
  return apiPost("/auth/login", credentials);
}

// PUBLIC_INTERFACE
export async function registerUser(data) {
  return apiPost("/auth/register", data);
}

// PUBLIC_INTERFACE
export async function fetchUserProfile() {
  return apiGet("/users/me");
}
