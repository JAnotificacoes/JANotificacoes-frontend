import { useState, useEffect, useCallback } from "react";
import { fetchTodayAbsences, triggerScan, sendManualNotification } from "@/services/api";

export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);

  // useCallback memoriza a função para evitar que ela seja recriada
  // a cada renderização — importante quando passamos funções como props
  const load = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchTodayAbsences();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect com array vazio [] roda apenas uma vez
  // quando o componente é montado na tela
  useEffect(() => {
    load();
  }, [load]);

  const scan = useCallback(async () => {
    try {
      setScanning(true);
      await triggerScan();
      // Recarrega os dados após o scan para refletir as novas faltas
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  }, [load]);

  const notify = useCallback(async (absenceId) => {
    try {
      await sendManualNotification(absenceId);
      // Recarrega para atualizar o status da notificação na tabela
      await load();
    } catch (err) {
      setError(err.message);
    }
  }, [load]);

  return { data, loading, error, scanning, scan, notify, reload: load };
}