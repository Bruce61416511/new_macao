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

export async function uploadQualificationFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  const token = getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${API_BASE}/applications/upload-file`, {
      method: "POST",
      headers,
      body: formData,
      signal: controller.signal,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.detail || "上传失败");
    }
    return res.json();
  } catch (err) {
    if (err && err.name === "AbortError") {
      throw new Error("上传超时，请检查网络后重试");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}