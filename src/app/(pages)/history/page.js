"use client";

import { useHistory } from "@/hooks/useHistory";
import { Badge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import styles from "./history.module.css";

export default function HistoryPage() {
  const { data, loading, error, filters, updateFilter, resetFilters } = useHistory();

  const columns = [
    { key: "student_name", label: "Aluno" },
    { key: "full_classroom", label: "Turma" },
    { key: "date", label: "Data da falta" },
    {
      key: "status",
      label: "Status",
      render: (row) => <Badge status={row.status} />,
    },
    {
      key: "origin",
      label: "Origem",
      render: (row) =>
        row.origin ? <Badge status={row.origin} /> : "—",
    },
    { key: "timestamp", label: "Horário do envio" },
    {
      key: "error_message",
      label: "Erro",
      render: (row) => row.error_message
        ? <span className={styles.errorMessage}>{row.error_message}</span>
        : "—",
    },
  ];

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div>
      <div className={styles.container}>

        {/* Filtros */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label className={styles.label}>De</label>
            <input
              type="date"
              className={styles.input}
              value={filters.date_from}
              onChange={(e) => updateFilter("date_from", e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.label}>Até</label>
            <input
              type="date"
              className={styles.input}
              value={filters.date_to}
              onChange={(e) => updateFilter("date_to", e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.label}>Turma</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Ex: 6A"
              value={filters.classroom}
              onChange={(e) => updateFilter("classroom", e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.label}>Status</label>
            <select
              className={styles.select}
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
            >
              <option value="">Todos</option>
              <option value="sent">Enviada</option>
              <option value="error">Erro</option>
              <option value="pending">Pendente</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button className={styles.resetButton} onClick={resetFilters}>
              Limpar filtros
            </button>
          )}
        </div>

        {/* Tabela */}
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Histórico de notificações</h2>
            <span className={styles.tableCount}>
              {data?.length ?? 0} registros
            </span>
          </div>
          <Table
            columns={columns}
            data={data}
            loading={loading}
            empty="Nenhuma notificação encontrada para os filtros selecionados."
          />
        </div>

        {error && (
          <p className={styles.error}>Erro ao carregar histórico: {error}</p>
        )}

      </div>
    </div>
  );
}