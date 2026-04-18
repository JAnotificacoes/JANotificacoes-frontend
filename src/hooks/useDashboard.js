import { useState, useEffect, useCallback } from "react";
import { fetchTodayAbsences, triggerScan, triggerCancel, sendManualNotification } from "@/services/api";

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

  const scanAndCancel = useCallback(async () => {
    try {
      setScanning(true);
      await triggerCancel();
      await triggerScan();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  }, [load]);

  useEffect(() => {
    scanAndCancel();
  }, []);

  const notify = useCallback(async (absenceId) => {
    try {
      await sendManualNotification(absenceId);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }, [load]);

  return { data, loading, error, scanning, scan: scanAndCancel, notify, reload: load };
}