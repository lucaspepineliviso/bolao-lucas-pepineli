export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function authHeaders(): HeadersInit {
  const token = getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function apiFetch(url: string, options: RequestInit = {}) {
  const headers = {
    ...options.headers,
    ...authHeaders(),
  };
  const res = await fetch(url, { ...options, headers });
  return res;
}
