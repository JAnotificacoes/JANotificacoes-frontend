import { useState, useEffect, useCallback } from "react";
import { fetchStatus } from "@/services/api";

export function useSettings() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
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

  useEffect(() => {
    load();

    // Verifica o status das integrações a cada 30 segundos automaticamente
    // Assim o coordenador vê em tempo real se o WhatsApp desconectou
    const interval = setInterval(load, 30000);

    // Limpa o interval quando o componente sai da tela
    // Evita memory leak — sem isso o interval continuaria rodando
    // mesmo depois do componente ser desmontado
    return () => clearInterval(interval);
  }, [load]);

  return { status, loading, error, reload: load };
}