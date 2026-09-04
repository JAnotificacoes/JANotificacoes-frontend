// Base URL do backend: via env (build-time no Next.js).
// dev: http://localhost:8000 | prod (Vercel): https://janotifica-api.onrender.com
// O fallback localhost existe só para dev — em produção sem a env, as
// chamadas falham; o erro abaixo deixa isso explícito no console.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

if (
  !process.env.NEXT_PUBLIC_API_URL &&
  typeof window !== "undefined" &&
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1"
) {
  console.error(
    "[JANotifica] NEXT_PUBLIC_API_URL não definida — chamadas à API vão mirar localhost e falhar. " +
      "Configure a env no deploy (Vercel) e faça rebuild."
  );
}

const AUTH_PATHS = ["/login", "/auth/register", "/auth/change-password"];

const defaultOptions = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};

function isAuthPath() {
  if (typeof window === "undefined") return false;
  return AUTH_PATHS.some((p) => window.location.pathname.startsWith(p));
}

async function handleResponse(res) {
  if (res.status === 401 && !isAuthPath()) {
    // Sessão inválida/expirada: apaga o cookie stale no servidor para o
    // proxy não rebater /login -> /dashboard em loop, e só então redireciona.
    try {
      await fetch(`${API_URL}/auth/logout`, {
        ...defaultOptions,
        method: "POST",
      });
    } catch {
      /* backend fora do ar: segue para o login mesmo assim */
    }
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Sessão expirada");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Erro ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// ── AUTH ──

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    ...defaultOptions,
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function logout() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    ...defaultOptions,
    method: "POST",
  });
  return handleResponse(res);
}

export async function me() {
  const res = await fetch(`${API_URL}/auth/me`, {
    ...defaultOptions,
  });
  return handleResponse(res);
}

export async function register(data) {
  const res = await fetch(`${API_URL}/auth/register`, {
    ...defaultOptions,
    method: "POST",
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function changePassword(currentPassword, newPassword) {
  const res = await fetch(`${API_URL}/auth/change-password`, {
    ...defaultOptions,
    method: "POST",
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });
  return handleResponse(res);
}

// ── USERS (Admin) ──

export async function listUsers() {
  const res = await fetch(`${API_URL}/users`, {
    ...defaultOptions,
  });
  return handleResponse(res);
}

export async function createUser(data) {
  const res = await fetch(`${API_URL}/users`, {
    ...defaultOptions,
    method: "POST",
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteUser(userId) {
  const res = await fetch(`${API_URL}/users/${userId}`, {
    ...defaultOptions,
    method: "DELETE",
  });
  return handleResponse(res);
}

export async function toggleAdmin(userId) {
  const res = await fetch(`${API_URL}/users/${userId}/admin`, {
    ...defaultOptions,
    method: "PATCH",
  });
  return handleResponse(res);
}

// ── DASHBOARD ──

export async function fetchTodayAbsences(params = {}) {
  const query = new URLSearchParams({
    page: params.page || 1,
    page_size: params.page_size || 20,
  }).toString();

  const res = await fetch(`${API_URL}/absences/today?${query}`, defaultOptions);
  const data = await handleResponse(res);

  return {
    ...data,
    items: data.absences,
  };
}

export async function triggerScan() {
  const res = await fetch(`${API_URL}/absences/scan`, {
    ...defaultOptions,
    method: "POST",
  });
  return handleResponse(res);
}

export async function triggerCancel() {
  const res = await fetch(`${API_URL}/absences/cancel`, {
    ...defaultOptions,
    method: "POST",
  });
  return handleResponse(res);
}

export async function sendManualNotification(absenceId) {
  const res = await fetch(`${API_URL}/absences/${absenceId}/notify`, {
    ...defaultOptions,
    method: "POST",
  });
  return handleResponse(res);
}

// ── ESTUDANTES ──

export async function searchStudents(q) {
  const res = await fetch(`${API_URL}/students/autocomplete?q=${encodeURIComponent(q)}`, defaultOptions);
  return handleResponse(res);
}

// ── HISTÓRICO ──

export async function fetchHistory(params = {}) {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v)
  );
  const query = new URLSearchParams(filtered).toString();
  const res = await fetch(`${API_URL}/notifications/history?${query}`, defaultOptions);
  return handleResponse(res);
}

// ── CONFIGURAÇÕES ──

export async function fetchStatus() {
  const res = await fetch(`${API_URL}/settings/status`, defaultOptions);
  return handleResponse(res);
}

export async function fetchTemplate() {
  const res = await fetch(`${API_URL}/settings/template`, defaultOptions);
  return handleResponse(res);
}

export async function saveTemplate(template) {
  const res = await fetch(`${API_URL}/settings/template`, {
    ...defaultOptions,
    method: "PUT",
    body: JSON.stringify({ template }),
  });
  return handleResponse(res);
}

export async function fetchQrCode() {
  const res = await fetch(`${API_URL}/settings/whatsapp/qrcode`, defaultOptions);
  return handleResponse(res);
}

export async function fetchWhatsAppStatus() {
  const res = await fetch(`${API_URL}/settings/status`, defaultOptions);
  return handleResponse(res);
}

export async function disconnectWhatsApp() {
  const res = await fetch(`${API_URL}/settings/whatsapp/disconnect`, {
    ...defaultOptions,
    method: "POST",
  });
  return handleResponse(res);
}