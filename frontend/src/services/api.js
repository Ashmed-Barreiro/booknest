const API_URL = "http://localhost:4000";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const message = typeof data === "object" && data?.message ? data.message : "Request error";
    throw new Error(message);
  }

  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
}
