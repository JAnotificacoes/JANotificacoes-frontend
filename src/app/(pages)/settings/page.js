"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";
import styles from "./settings.module.css";

const VARIABLES = [
  { key: "{guardian_name}", label: "Nome do responsável" },
  { key: "{student_name}", label: "Nome do aluno" },
  { key: "{full_classroom}", label: "Turma do aluno (6A, 7B)" },
  { key: "{date}", label: "Data da falta" },
];

export default function SettingsPage() {
  const {
    status, loading, error,
    template, saving, saveError, saveSuccess,
    updateTemplate,
  } = useSettings();

  const [draft, setDraft] = useState("");

  // Sincroniza o draft quando o template carrega do banco
  useEffect(() => {
    if (template) setDraft(template);
  }, [template]);

  const isDirty = draft !== template;

  return (
    <div>
      <div className={styles.container}>

        {/* Status das integrações */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Status das integrações</h2>
          <div className={styles.statusGrid}>
            <StatusCard
              label="Banco de dados"
              status={status?.database}
              loading={loading}
            />
            <StatusCard
              label="Google Sheets"
              status={status?.sheets}
              loading={loading}
            />
            <StatusCard
              label="WhatsApp"
              status={status?.whatsapp}
              loading={loading}
            />
          </div>
        </section>

        {/* Template da mensagem */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Template da mensagem</h2>
          <p className={styles.sectionDesc}>
            Personalize a mensagem enviada aos responsáveis. Use as variáveis
            abaixo para inserir dados dinâmicos.
          </p>

          {/* Variáveis disponíveis */}
          <div className={styles.variables}>
            {VARIABLES.map((v) => (
              <span key={v.key} className={styles.variable}>
                <code className={styles.varCode}>{v.key}</code>
                <span className={styles.varLabel}>{v.label}</span>
              </span>
            ))}
          </div>

          {/* Editor */}
          <textarea
            className={styles.textarea}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={10}
            spellCheck={false}
          />

          {/* Feedback */}
          {saveError && (
            <p className={styles.saveError}>{saveError}</p>
          )}
          {saveSuccess && (
            <p className={styles.saveSuccess}>Template salvo com sucesso.</p>
          )}

          {/* Ações */}
          <div className={styles.actions}>
            <button
              className={styles.resetButton}
              onClick={() => setDraft(template)}
              disabled={!isDirty || saving}
            >
              Descartar alterações
            </button>
            <button
              className={styles.saveButton}
              onClick={() => updateTemplate(draft)}
              disabled={!isDirty || saving}
            >
              {saving ? "Salvando..." : "Salvar template"}
            </button>
          </div>
        </section>
        <div className={styles.errorContainer}>
          {error && (
            <p className={styles.error}>Erro ao carregar configurações: {error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusCard({ label, status, loading }) {
  const isOnline = status?.status === "ok" || status?.status === "online";

  return (
    <div className={styles.statusCard}>
      <span className={`${styles.statusDot} ${isOnline ? styles.dotOnline : styles.dotOffline}`} />
      <div className={styles.statusInfo}>
        <span className={styles.statusLabel}>{label}</span>
        <span className={styles.statusValue}>
          {loading ? "Verificando..." : isOnline ? "Online" : (status?.message ?? "Offline")}
        </span>
      </div>
    </div>
  );
}