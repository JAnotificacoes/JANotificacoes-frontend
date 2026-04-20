import { useState, useCallback } from "react";
import { usePaginated } from "@/hooks/usePagination";
import { fetchTodayAbsences, triggerScan, triggerCancel, sendManualNotification } from "@/services/api";

export function useDashboard() {

  const { data, loading, error, reload, page, setPage } = usePaginated(fetchTodayAbsences);
  const [scanning, setScanning] = useState(false);

  const scanAndCancel = useCallback(async () => {
    try {
      setScanning(true);
      await triggerCancel();
      await triggerScan();
      await reload(); // Recarrega a página atual
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  }, [reload]);

  const notify = useCallback(async (absenceId) => {
    try {
      await sendManualNotification(absenceId);
      await reload();
    } catch (err) {
      console.error(err);
    }
  }, [reload]);

  return { data, loading, error, scanning, scan: scanAndCancel, notify, reload, page, setPage };
}