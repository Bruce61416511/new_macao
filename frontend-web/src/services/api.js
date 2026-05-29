const API_BASE = "/v1";

function getToken() {
  return sessionStorage.getItem("token");
}

function setToken(token) {
  if (token) sessionStorage.setItem("token", token);
  else sessionStorage.removeItem("token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401) {
    setToken(null);
    window.location.href = "/login";
    throw new Error("未登录");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.detail || `请求失败 (${res.status})`);
  return data;
}

export async function login(username, password) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  setToken(data.access_token);
  return data;
}

export function logout() {
  setToken(null);
  window.location.href = "/login";
}

export function isAuthenticated() {
  return !!getToken();
}

export async function getMyProfile() {
  return request("/members/me");
}

export { getToken, setToken };
export default request;

export async function checkDuplicate(username, idNumber) {
  const params = new URLSearchParams();
  if (username) params.set("username", username);
  if (idNumber) params.set("id_number", idNumber);
  return request(`/applications/check?${params.toString()}`);
}
