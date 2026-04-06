const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── DASHBOARD ──

export async function fetchTodayAbsences() {
  const res = await fetch(`${API_URL}/absences/today`);
  if (!res.ok) throw new Error("Failed to fetch today absences");
  return res.json();
}

export async function triggerScan() {
  const res = await fetch(`${API_URL}/absences/scan`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to trigger scan");
  return res.json();
}

export async function sendManualNotification(absenceId) {
  const res = await fetch(`${API_URL}/absences/${absenceId}/notify`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to send manual notification");
  return res.json();
}

// ── HISTÓRICO ──

export async function fetchHistory(params = {}) {
  // Remove parâmetros vazios antes de montar a query string
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v)
  );
  const query = new URLSearchParams(filtered).toString();
  const res = await fetch(`${API_URL}/notifications/history?${query}`);
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}

// ── CONFIGURAÇÕES ──

export async function fetchStatus() {
  const res = await fetch(`${API_URL}/settings/status`);
  if (!res.ok) throw new Error("Failed to fetch status");
  return res.json();
}