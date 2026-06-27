const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── DASHBOARD ──

export async function fetchTodayAbsences(params = {}) {
  const query = new URLSearchParams({
    page: params.page || 1,
    page_size: params.page_size || 20,
    // adicione outros filtros se necessário
  }).toString();

  const res = await fetch(`${API_URL}/absences/today?${query}`);
  if (!res.ok) throw new Error("Failed to fetch today absences");
  
  const data = await res.json();
  
  // O usePaginated espera que a lista de itens esteja em uma chave 'items'
  return {
    ...data,
    items: data.absences // Mapeia 'absences' para 'items' para ser compatível com o hook
  };
}

export async function triggerScan() {
  const res = await fetch(`${API_URL}/absences/scan`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to trigger scan");
  return res.json();
}

export async function triggerCancel() {
  const res = await fetch(`${API_URL}/absences/cancel`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to trigger cancel");
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

export async function fetchTemplate() {
  const res = await fetch(`${API_URL}/settings/template`);
  if (!res.ok) throw new Error("Failed to fetch template");
  return res.json();
}

export async function saveTemplate(template) {
  const res = await fetch(`${API_URL}/settings/template`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ template }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to save template");
  }
  return res.json();
}

export async function fetchQrCode() {
  const res = await fetch(`${API_URL}/settings/whatsapp/qrcode`);
  if (!res.ok) throw new Error("Failed to fetch QR code");
  return res.json();
}

export async function fetchWhatsAppStatus() {
  const res = await fetch(`${API_URL}/settings/status`);
  if (!res.ok) throw new Error("Failed to fetch status");
  return res.json();
}