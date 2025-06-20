import { apiGet, apiPost, apiPut, apiDelete } from "./apiClient";

// PUBLIC_INTERFACE
export async function fetchTickets(query = "") {
  return apiGet(`/tickets${query ? `?${query}` : ""}`);
}

// PUBLIC_INTERFACE
export async function fetchTicket(id) {
  return apiGet(`/tickets/${id}`);
}

// PUBLIC_INTERFACE
export async function createTicket(data) {
  return apiPost("/tickets", data);
}

// PUBLIC_INTERFACE
export async function updateTicket(id, data) {
  return apiPut(`/tickets/${id}`, data);
}

// PUBLIC_INTERFACE
export async function deleteTicket(id) {
  return apiDelete(`/tickets/${id}`);
}
