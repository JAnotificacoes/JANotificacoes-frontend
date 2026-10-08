import { useState, useEffect, useCallback } from "react";
import { fetchStatus, fetchTemplate, saveTemplate } from "@/services/api";
import { useToast } from "@/components/ui/ToastProvider";

// Poll espaçado: cada poll é 1 fetchInstances no Evo (plano gratuito com
// throttle agressivo). 30s + N abas gerou os 429 de 08/10/2026.
const STATUS_POLL_MS = 60000;

export function useSettings(options = {}) {
  // paused=true suspende o poll de status (ex. durante a geração do QR,
  // para não somar um fetchInstances concorrente ao connect).
  const { paused = false } = options;
  const [visible, setVisible] = useState(
    typeof document === "undefined" ? true : !document.hidden
  );
  const [status, setStatus] = useState(null);
  const [template, setTemplate] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const loadStatus = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchStatus();
      setStatus(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTemplate = useCallback(async () => {
    try {
      const result = await fetchTemplate();
      setTemplate(result.template);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadStatus();
    loadTemplate();
  }, [loadStatus, loadTemplate]);

  // Aba oculta não polla: segunda aba em segundo plano não deve custar
  // chamadas ao Evo.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (paused || !visible) return;
    const interval = setInterval(loadStatus, STATUS_POLL_MS);
    return () => clearInterval(interval);
  }, [paused, visible, loadStatus]);

  const updateTemplate = useCallback(async (newTemplate) => {
    try {
      setSaving(true);
      const result = await saveTemplate(newTemplate);
      setTemplate(result.template);
      toast.success("Template salvo com sucesso.");
    } catch (err) {
      toast.error(err.message || "Erro ao salvar template.");
    } finally {
      setSaving(false);
    }
  }, [toast]);

  return {
    status, loading, error,
    template, saving,
    updateTemplate,
  };
}