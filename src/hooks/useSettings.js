import { useState, useEffect, useCallback } from "react";
import { fetchStatus, fetchTemplate, saveTemplate } from "@/services/api";
import { useToast } from "@/components/ui/ToastProvider";

export function useSettings() {
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

    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, [loadStatus, loadTemplate]);

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
    updateTemplate, reload: loadStatus,
  };
}