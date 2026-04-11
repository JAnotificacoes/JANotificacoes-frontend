"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const { data, loading, error, scanning, scan, notify } = useDashboard();

  // Colunas da tabela de faltantes
  // render customizado para status e ação de notificação manual
  const columns = [
    { key: "student_name", label: "Aluno" },
    { key: "full_classroom", label: "Turma" },
    { key: "guardian_name", label: "Responsável" },
    {
      key: "notification_status",
      label: "Notificação",
      render: (row) => <Badge status={row.notification_status} />,
    },
    {
      key: "notification_origin",
      label: "Origem",
      render: (row) =>
        row.notification_origin ? (
          <Badge status={row.notification_origin} />
        ) : (
          "—"
        ),
    },
    { key: "notification_time", label: "Horário" },
    {
      key: "action",
      label: "Notificar manualmente",
      render: (row) => (
        <button
          onClick={() => notify(row.absence_id)}
          className={styles.notifyButton}
        >
          Notificar
        </button>
      ),  
    },
  ];

  return (
    <div>
      <div className={styles.container}>

        {/* Data de hoje */}
        <p className={styles.date}>
          {data?.date ?? "Carregando..."}
        </p>

        {/* Cards de contadores */}
        <div className={styles.cards}>
          <StatCard
            title="Total de faltas"
            value={data?.total ?? "—"}
            color="blue"
          />
          <StatCard
            title="Notificações enviadas"
            value={data?.sent ?? "—"}
            color="green"
          />
          <StatCard
            title="Erros de envio"
            value={data?.errors ?? "—"}
            color="red"
          />
        </div>

        {/* Tabela de faltantes */}
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>
              Alunos faltantes
            </h2>
            <span className={styles.tableCount}>
              {data?.total ?? 0} registros
            </span>
          </div>
          <Table
            columns={columns}
            data={data?.absences}
            loading={loading}
            empty="Nenhuma falta registrada hoje."
          />
        </div>

        <button
          onClick={scan}
          disabled={scanning}
          className={styles.scanButton}
        >
          {scanning ? "Escaneando..." : "Executar scan"}
        </button>

        {/* Exibe erro se houver */}
        {error && (
          <p className={styles.error}>
            Erro ao carregar dados: {error}
          </p>
        )}

      </div>
    </div>
  );
}