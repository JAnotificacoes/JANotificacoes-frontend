"use client";
import { useDashboard } from "@/hooks/useDashboard";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const { data, loading, error, scanning, scan, notify, page, setPage } = useDashboard();

  const columns = [
    { key: "student_name", label: "Aluno" },
    { key: "full_classroom", label: "Turma" },
    { key: "guardian_name", label: "Responsável" },
    {
      key: "notification_status",
      label: "Notificação",
      render: (row) => <Badge status={row.notification_status} />,
    },
    { key: "notification_time", label: "Horário" },
    {
      key: "action",
      label: "Notificar",
      render: (row) => (
        <button onClick={() => notify(row.absence_id)} className={styles.actionButton}>
          Notificar
        </button>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <p className={styles.date}>{data?.date ?? "Carregando..."}</p>

      <div className={styles.toolbar}>
        <button onClick={scan} disabled={scanning} className={styles.scanButton}>
          {scanning ? "Escaneando..." : "Executar scan"}
        </button>
        <span className={styles.toolbarCount}>
          {data?.total ?? "—"} falta{data?.total !== 1 ? "s" : ""} hoje
        </span>
      </div>

      <div className={styles.cards}>
        <StatCard title="Total de faltas" value={data?.total ?? "\u2014"} color="blue" />
        <StatCard title="Enviadas" value={data?.sent ?? "\u2014"} color="green" />
        <StatCard title="Erros" value={data?.errors ?? "\u2014"} color="red" />
      </div>

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
              disabled={page <= 1}
              className={styles.pageButton}
            >
              Anterior
            </button>
            <span className={styles.pageIndicator}>
              Página <strong>{page}</strong> de {data?.pages || 1}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= (data?.pages || 1)}
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
    </div>
  );
}
