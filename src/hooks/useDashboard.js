import { useState, useCallback } from "react";
import { usePaginated } from "@/hooks/usePagination";
import { useToast } from "@/components/ui/ToastProvider";
import { fetchTodayAbsences, triggerScan, triggerCancel, sendManualNotification } from "@/services/api";

export function useDashboard() {

  const { data, loading, error, reload, page, setPage } = usePaginated(fetchTodayAbsences);
  const [scanning, setScanning] = useState(false);
  const { toast } = useToast();

  const scanAndCancel = useCallback(async () => {
    try {
      setScanning(true);
      await triggerCancel();
      await triggerScan();
      await reload();
      toast.success("Scan concluído.");
    } catch (err) {
      toast.error(err.message || "Erro ao executar scan");
    } finally {
      setScanning(false);
    }
  }, [reload, toast]);

  const notify = useCallback(async (absenceId) => {
    try {
      await sendManualNotification(absenceId);
      await reload();
      toast.success("Notificação enviada.");
    } catch (err) {
      toast.error(err.message || "Erro ao enviar notificação");
    }
  }, [reload, toast]);

  return { data, loading, error, scanning, scan: scanAndCancel, notify, reload, page, setPage };
}