// Centralized API base URL.
// In Kubernetes, Traefik routes /api/* to the backend.
const API_BASE_URL = "/api";

async function handleResponse(res) {
  let data = null;

  try {
    data = await res.json();
  } catch {
    // Ignore if response has no JSON body
  }

  if (!res.ok) {
    const error = new Error(
      (data && data.error) || `Request failed with status ${res.status}`
    );
    error.status = res.status;
    error.payload = data;
    throw error;
  }

  return data;
}

export async function fetchMenu() {
  const res = await fetch(`${API_BASE_URL}/menu`);
  return handleResponse(res);
}

export async function createOrder(orderData) {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  return handleResponse(res);
}

export async function getOrder(orderId) {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}`);
  return handleResponse(res);
}
