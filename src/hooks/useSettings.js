import { useState, useEffect, useCallback } from "react";
import { fetchStatus, fetchTemplate, saveTemplate } from "@/services/api";

export function useSettings() {
  const [status, setStatus] = useState(null);
  const [template, setTemplate] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, [loadStatus, loadTemplate]);

  const updateTemplate = useCallback(async (newTemplate) => {
    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);
      const result = await saveTemplate(newTemplate);
      setTemplate(result.template);
      setSaveSuccess(true);
      // Limpa o feedback de sucesso após 3 segundos
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    status, loading, error,
    template, saving, saveError, saveSuccess,
    updateTemplate, reload: loadStatus,
  };
}