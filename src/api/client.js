// Centralized API base URL. Set REACT_APP_API_URL in a .env file at the
// project root to point at your backend (defaults to localhost for dev).
const API_BASE_URL = "/api";

async function handleResponse(res) {
  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body — fine for some error responses
  }

  if (!res.ok) {
    const error = new Error((data && data.error) || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.payload = data;
    throw error;
  }

  return data;
}

export async function fetchMenu() {
  const res = await fetch(`${API_BASE_URL}/api/menu`);
  return handleResponse(res);
}

export async function createOrder(orderPayload) {
  const res = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload),
  });
  return handleResponse(res);
}

export async function fetchOrder(orderId) {
  const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);
  return handleResponse(res);
}

export { API_BASE_URL };
