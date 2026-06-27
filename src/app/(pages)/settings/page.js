"use client";

import { useState, useEffect, useCallback } from "react";
import { useSettings } from "@/hooks/useSettings";
import { useToast } from "@/components/ui/ToastProvider";
import { fetchQrCode, fetchWhatsAppStatus } from "@/services/api";
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
    template, saving,
    updateTemplate,
  } = useSettings();

  const [draft, setDraft] = useState("");

  const { toast } = useToast();

  const [qrcode, setQrcode] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  // Sincroniza o draft quando o template carrega do banco
  useEffect(() => {
    if (template) setDraft(template);
  }, [template]);

  const loadQrCode = useCallback(async () => {
    setQrLoading(true);
    try {
      const data = await fetchQrCode();
      if (data.connected) {
        setConnected(true);
        setQrcode(null);
      } else {
        setConnected(false);
        setQrcode(data.qrcode);
      }
    } catch {
      setQrcode(null);
      toast.error("Erro ao gerar QR Code. Verifique a conexão com a Evolution API.");
    } finally {
      setQrLoading(false);
    }
  }, []);

  useEffect(() => {
  const check = async () => {
    try {
      const data = await fetchWhatsAppStatus();
      const isConnected = data?.whatsapp?.state === "open";
      setConnected(isConnected);
      if (!isConnected) setQrcode(null);
    } catch {
      setConnected(false);
    }
  };

  check();
  const interval = setInterval(check, 15000);
  return () => clearInterval(interval);
}, []);

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
        {/*Seção QR Code */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Conexão WhatsApp</h2>
          <p className={styles.sectionDesc}>
            Escaneie o QR Code abaixo com o WhatsApp da escola para conectar o sistema.
          </p>

          <div className={styles.qrcodeSection}>
            {connected ? (
              <p className={styles.saveSuccess}>WhatsApp conectado.</p>
            ) : qrLoading ? (
              <p className={styles.qrcodeHint}>Carregando QR Code...</p>
            ) : qrcode ? (
              <>
                <img src={qrcode} alt="QR Code WhatsApp" className={styles.qrcodeImage} />
                <p className={styles.qrcodeHint}>
                  Abra o WhatsApp → Dispositivos conectados → Conectar dispositivo
                </p>
              </>
            ) : (
              <p className={styles.qrcodeHint}>Clique no botão para gerar o QR Code.</p>
            )}

            {!connected && (
              <button className={styles.qrcodeButton} onClick={loadQrCode} disabled={qrLoading}>
                {qrLoading ? "Carregando..." : qrcode ? "Atualizar QR Code" : "Gerar QR Code"}
              </button>
            )}
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