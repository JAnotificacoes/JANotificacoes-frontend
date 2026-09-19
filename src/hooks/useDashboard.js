import { useState, useCallback, useRef } from "react";
import { usePaginated } from "@/hooks/usePagination";
import { useToast } from "@/components/ui/ToastProvider";
import { fetchTodayAbsences, triggerScan, triggerCancel, sendManualNotification, sendBatchNotifications } from "@/services/api";

const BATCH_CHUNK_SIZE = 10;

export function isBatchEligible(row) {
  return row?.notification_status === "pending" || row?.notification_status === "error";
}

export function useDashboard() {

  const { data, loading, error, reload, page, setPage } = usePaginated(fetchTodayAbsences);
  const [scanning, setScanning] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedMeta, setSelectedMeta] = useState({});
  const [batchSending, setBatchSending] = useState(false);
  const [batchProgress, setBatchProgress] = useState(null);
  const [batchErrors, setBatchErrors] = useState([]);
  const cancelRef = useRef(false);
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

  const isSelected = useCallback((absenceId) => selectedIds.includes(absenceId), [selectedIds]);

  const toggleOne = useCallback((row) => {
    if (!isBatchEligible(row)) return;
    const id = row.absence_id;
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    setSelectedMeta((prev) => {
      if (prev[id]) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: { student_name: row.student_name } };
    });
  }, []);

  const togglePage = useCallback((items = []) => {
    const eligible = items.filter(isBatchEligible);
    if (eligible.length === 0) return;
    const ids = eligible.map((r) => r.absence_id);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
      setSelectedMeta((prev) => {
        const next = { ...prev };
        ids.forEach((id) => delete next[id]);
        return next;
      });
    } else {
      setSelectedIds((prev) => [...prev, ...ids.filter((id) => !prev.includes(id))]);
      setSelectedMeta((prev) => {
        const next = { ...prev };
        eligible.forEach((r) => {
          next[r.absence_id] = { student_name: r.student_name };
        });
        return next;
      });
    }
  }, [selectedIds]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
    setSelectedMeta({});
    setBatchErrors([]);
    setBatchProgress(null);
  }, []);

  const cancelBatch = useCallback(() => {
    cancelRef.current = true;
  }, []);

  const notifyBatch = useCallback(async () => {
    if (selectedIds.length === 0 || batchSending) return;
    cancelRef.current = false;
    setBatchSending(true);
    setBatchErrors([]);
    const total = selectedIds.length;
    let done = 0;
    let ok = 0;
    let fail = 0;
    const failures = [];
    const queue = [...selectedIds];

    try {
      for (let i = 0; i < queue.length; i += BATCH_CHUNK_SIZE) {
        if (cancelRef.current) break;
        const chunk = queue.slice(i, i + BATCH_CHUNK_SIZE);
        const currentName = selectedMeta[chunk[0]]?.student_name || `Lote ${Math.floor(i / BATCH_CHUNK_SIZE) + 1}`;
        setBatchProgress({ done, total, ok, fail, currentName });

        let res;
        try {
          res = await sendBatchNotifications(chunk);
        } catch (err) {
          // Chunk inteiro falhou (rede/429/500): conta todos como erro e segue.
          fail += chunk.length;
          done += chunk.length;
          chunk.forEach((id) => {
            failures.push({
              absence_id: id,
              student_name: selectedMeta[id]?.student_name || `#${id}`,
              error: err.message || "Erro ao enviar lote",
            });
          });
          setBatchProgress({ done, total, ok, fail, currentName });
          continue;
        }

        const byId = new Map((res.results || []).map((r) => [r.absence_id, r]));
        chunk.forEach((id) => {
          const r = byId.get(id);
          if (!r) {
            fail += 1;
            failures.push({ absence_id: id, student_name: selectedMeta[id]?.student_name || `#${id}`, error: "Sem resposta do servidor" });
            return;
          }
          if (r.skipped || r.success) {
            ok += 1;
          } else {
            fail += 1;
            failures.push({
              absence_id: id,
              student_name: selectedMeta[id]?.student_name || `#${id}`,
              error: r.error || "Erro ao enviar",
            });
          }
        });
        done += chunk.length;
        setBatchProgress({ done, total, ok, fail, currentName });
      }

      await reload();

      // Mantém só as falhas selecionadas; sucessos/pulados saem da seleção.
      const failIds = new Set(failures.map((f) => f.absence_id));
      setSelectedIds((prev) => prev.filter((id) => failIds.has(id)));
      setSelectedMeta((prev) => {
        const next = {};
        failIds.forEach((id) => {
          if (prev[id]) next[id] = prev[id];
        });
        return next;
      });
      setBatchErrors(failures);

      if (cancelRef.current) {
        toast.success(`Envio interrompido: ${ok} enviada(s), ${fail} falha(s).`);
      } else if (fail === 0) {
        toast.success(`${ok} notificação(ões) enviada(s).`);
      } else if (ok === 0) {
        toast.error(`${fail} falha(s) no envio. Verifique a lista.`);
      } else {
        toast.success(`${ok} enviada(s), ${fail} falha(s). Falhas mantidas selecionadas.`);
      }
    } finally {
      setBatchSending(false);
      setBatchProgress((p) => (p ? { ...p, done, total, ok, fail } : p));
    }
  }, [selectedIds, selectedMeta, batchSending, reload, toast]);

  return {
    data, loading, error, scanning, scan: scanAndCancel, notify, page, setPage,
    selectedIds, selectedMeta, selectedCount: selectedIds.length,
    isSelected, toggleOne, togglePage, clearSelection,
    batchSending, batchProgress, batchErrors, notifyBatch, cancelBatch,
  };
}
