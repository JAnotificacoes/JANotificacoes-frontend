import { useState, useEffect, useCallback } from "react";
import { fetchTodayAbsences, triggerScan, sendManualNotification } from "@/services/api";

export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);

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

  const scan = useCallback(async () => {
    try {
      setScanning(true);
      await triggerScan();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  }, [load]);

  // Executa scan + load na montagem
  useEffect(() => {
    scan();
  }, []);

  const notify = useCallback(async (absenceId) => {
    try {
      await sendManualNotification(absenceId);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }, [load]);

  return { data, loading, error, scanning, scan, notify, reload: load };
}