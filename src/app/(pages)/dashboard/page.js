"use client";
import { useState } from "react";
import { useDashboard, isBatchEligible } from "@/hooks/useDashboard";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const {
    data, loading, error, scanning, scan, notify, page, setPage,
    filters, updateFilter,
    selectedIds, selectedCount, isSelected, toggleOne, togglePage, clearSelection,
    batchSending, batchProgress, batchErrors, notifyBatch, cancelBatch,
  } = useDashboard();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const items = data?.items ?? [];
  const eligibleOnPage = items.filter(isBatchEligible);
  const allPageSelected = eligibleOnPage.length > 0 && eligibleOnPage.every((r) => isSelected(r.absence_id));

  const columns = [
    {
      key: "select",
      label: (
        <input
          type="checkbox"
          aria-label="Selecionar todos da página"
          checked={allPageSelected}
          disabled={eligibleOnPage.length === 0}
          onChange={() => togglePage(items)}
        />
      ),
      render: (row) => {
        const eligible = isBatchEligible(row);
        const isNotF = (row.absence_type ?? "F") !== "F";
        return (
          <input
            type="checkbox"
            aria-label={`Selecionar ${row.student_name}`}
            checked={isSelected(row.absence_id)}
            disabled={!eligible || batchSending}
            title={isNotF ? "Somente faltas simples (F) participam do lote" : eligible ? "Selecionar para envio em lote" : "Já enviada — sem reenvio"}
            onChange={() => toggleOne(row)}
          />
        );
      },
    },
    { key: "student_name", label: "Aluno" },
    { key: "full_classroom", label: "Turma" },
    { key: "guardian_name", label: "Responsável" },
    {
      key: "absence_type",
      label: "Tipo",
      render: (row) => <Badge status={`type-${row.absence_type ?? "F"}`} />,
    },
    {
      key: "notification_status",
      label: "Notificação",
      render: (row) => <Badge status={row.notification_status} />,
    },
    { key: "notification_time", label: "Horário" },
    {
      key: "action",
      label: "Notificar",
      render: (row) => {
        // Só faltas simples (F) são notificáveis; FA/S mostram detalhe.
        if ((row.absence_type ?? "F") !== "F") {
          return (
            <span title="Somente faltas simples (F) são notificadas">—</span>
          );
        }
        return (
          <button onClick={() => notify(row.absence_id)} className={styles.actionButton} disabled={batchSending}>
            Notificar
          </button>
        );
      },
    },
  ];

  const progressPct = batchProgress && batchProgress.total > 0
    ? Math.round((batchProgress.done / batchProgress.total) * 100)
    : 0;

  return (
    <div className={styles.container}>
      <p className={styles.date}>{data?.date ?? "Carregando..."}</p>

      <div className={styles.toolbar}>
        <button onClick={scan} disabled={scanning || batchSending} className={styles.scanButton}>
          {scanning ? "Escaneando..." : "Executar scan"}
        </button>
        <label className={styles.toolbarFilter}>
          Filtrar por tipo de falta{" "}
          <select
            aria-label="Filtrar por tipo de falta"
            value={filters.absence_type ?? ""}
            onChange={(e) => updateFilter("absence_type", e.target.value || "")}
            disabled={batchSending}
          >
            <option value="">Todas</option>
            <option value="F">Falta</option>
            <option value="FA">Falta c/ atestado</option>
            <option value="S">Suspenso</option>
          </select>
        </label>
        <span className={styles.toolbarCount}>
          {data?.total ?? "—"} falta{data?.total !== 1 ? "s" : ""} hoje
        </span>
      </div>

      <div className={styles.cards}>
        <StatCard title="Total de faltas" value={data?.total ?? "—"} color="blue" />
        <StatCard title="Enviadas" value={data?.sent ?? "—"} color="green" />
        <StatCard title="Erros" value={data?.errors ?? "—"} color="red" />
      </div>

      <div className={styles.batchBar}>
        <div className={styles.batchInfo}>
          <span className={styles.batchCount}>
            {selectedCount} selecionado{selectedCount !== 1 ? "s" : ""} (faltas F pendentes + erros, vale entre páginas)
          </span>
          {selectedCount > 0 && (
            <button onClick={clearSelection} disabled={batchSending} className={styles.clearButton}>
              Limpar seleção
            </button>
          )}
        </div>
        <button
          onClick={() => setConfirmOpen(true)}
          disabled={selectedCount === 0 || batchSending}
          className={styles.batchButton}
        >
          {batchSending ? "Enviando..." : `Enviar notificação${selectedCount > 0 ? ` (${selectedCount})` : ""}`}
        </button>
      </div>

      {(batchSending || batchProgress) && (
        <div className={styles.progressCard} role="status" aria-live="polite">
          <div className={styles.progressHeader}>
            <span>
              {batchSending
                ? `Enviando ${batchProgress?.done ?? 0}/${batchProgress?.total ?? selectedCount} — ${batchProgress?.currentName ?? ""}`
                : `Concluído: ${batchProgress?.ok ?? 0} enviada(s), ${batchProgress?.fail ?? 0} falha(s)`}
            </span>
            {batchSending && (
              <button onClick={cancelBatch} className={styles.clearButton}>
                Interromper
              </button>
            )}
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
          </div>
          <span className={styles.progressMeta}>
            {(batchProgress?.ok ?? 0)} ok · {(batchProgress?.fail ?? 0)} erros
          </span>
        </div>
      )}

      {batchErrors.length > 0 && !batchSending && (
        <div className={styles.errorCard}>
          <strong>Falhas mantidas selecionadas ({batchErrors.length}):</strong>
          <ul className={styles.errorList}>
            {batchErrors.slice(0, 10).map((f) => (
              <li key={f.absence_id}>
                {f.student_name} — {f.error}
              </li>
            ))}
          </ul>
          {batchErrors.length > 10 && (
            <span className={styles.progressMeta}>+ {batchErrors.length - 10} outras…</span>
          )}
        </div>
      )}

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Alunos faltantes</h2>
          <span className={styles.tableCount}>
            {data?.total ?? 0} registro{data?.total !== 1 ? "s" : ""}
          </span>
        </div>

        <Table
          columns={columns}
          data={data?.items}
          loading={loading}
          empty="Nenhuma falta registrada hoje."
        />

        {!loading && data?.pages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1 || batchSending}
              className={styles.pageButton}
            >
              Anterior
            </button>
            <span className={styles.pageIndicator}>
              Página <strong>{page}</strong> de {data?.pages || 1}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= (data?.pages || 1) || batchSending}
              className={styles.pageButton}
            >
              Próxima
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className={styles.error}>Erro ao carregar dados: {error}</p>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Enviar notificações em lote"
        message={`Enviar a mensagem do template salvo para ${selectedCount} responsável(eis) selecionado(s)? Somente faltas simples (F) pendentes e com erro serão processadas; atestados, suspensos e já enviadas são ignorados.`}
        confirmLabel="Enviar notificação"
        onConfirm={() => {
          setConfirmOpen(false);
          notifyBatch();
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
