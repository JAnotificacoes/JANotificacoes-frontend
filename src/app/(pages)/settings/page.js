"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSettings } from "@/hooks/useSettings";
import { useToast } from "@/components/ui/ToastProvider";
import { fetchQrCode, createWhatsAppInstance, disconnectWhatsApp, me } from "@/services/api";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import styles from "./settings.module.css";

const VARIABLES = [
  { key: "{guardian_name}", label: "Nome do responsável" },
  { key: "{student_name}", label: "Nome do aluno" },
  { key: "{full_classroom}", label: "Turma do aluno (6A, 7B)" },
  { key: "{date}", label: "Data da falta" },
];

// Cooldown compartilhado entre reloads e abas do mesmo navegador: o
// carimbo real continua no servidor; isto só espelha para a UI não
// "furar" a trava ao recarregar a página.
const QR_COOLDOWN_KEY = "janotifica:qr-cooldown-until";

function readSharedCooldown() {
  try {
    const until = Number(localStorage.getItem(QR_COOLDOWN_KEY) || 0);
    const remaining = Math.ceil((until - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  } catch {
    return 0;
  }
}

function writeSharedCooldown(seconds) {
  try {
    localStorage.setItem(QR_COOLDOWN_KEY, String(Date.now() + seconds * 1000));
  } catch {
    // storage indisponível (modo privado): segue só com o state local.
  }
}

// GET qrcode é só leitura: se a instância não existir (404), cria uma
// única vez via POST e tenta o GET de novo. Mantém o UX de 1 clique
// para o admin sem devolver efeito colateral ao GET em loop.
async function fetchQrCodeWithCreateFallback() {
  try {
    return await fetchQrCode();
  } catch (err) {
    if (err.status === 404) {
      await createWhatsAppInstance();
      return await fetchQrCode();
    }
    throw err;
  }
}

export default function SettingsPage() {
  const [qrcode, setQrcode] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  // Cooldown visível após 429 (segundos restantes). Evita zerar o
  // cooldown do WhatsApp com novos cliques.
  const [cooldown, setCooldown] = useState(0);
  // Trava síncrona anti-duplo-clique: state é assíncrono e dois cliques
  // rápidos passariam pelo `qrLoading` antes dele atualizar.
  const isFetchingRef = useRef(false);

  // Pausa o poll de /settings/status durante a geração do QR para não
  // somar um fetchInstances concorrente ao connect.
  const {
    status, loading, error,
    template, saving,
    updateTemplate,
  } = useSettings({ paused: qrLoading });

  const [draft, setDraft] = useState("");
  const { toast } = useToast();

  // Papel do usuário logado (padrão users/page.js): QR e edição de
  // template são admin-only no backend; a UI oculta essas ações para
  // não-admins em vez de deixar estourar 403 no clique.
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    let cancelled = false;
    me().then((u) => {
      if (!cancelled) setCurrentUser(u);
    }).catch(() => {
      // 401 redireciona para /login dentro do api.js; aqui só ignora.
    });
    return () => { cancelled = true; };
  }, []);
  const isAdmin = currentUser?.is_admin === true;

  // Reconstrói o countdown após reload: sem isso o reload zerava a UI
  // mas o carimbo no servidor continuava valendo (429 "no primeiro clique").
  useEffect(() => {
    setCooldown(readSharedCooldown());
  }, []);

  const handleConfirmDisconnect = useCallback(async () => {
    setShowDisconnectModal(false);
    setDisconnecting(true);
    try {
      await disconnectWhatsApp();
      setConnected(false);
      setQrcode(null);
      toast.success("WhatsApp desconectado com sucesso.");
    } catch (err) {
      toast.error(err.message || "Erro ao desconectar WhatsApp.");
    } finally {
      setDisconnecting(false);
    }
  }, [toast]);

  useEffect(() => {
    if (template) setDraft(template);
  }, [template]);

  const loadQrCode = useCallback(async () => {
    // Trava dupla (ref síncrona + state): 1 clique = 1 request.
    // Barreira de papel: o backend também exige admin (403).
    if (!isAdmin || isFetchingRef.current || qrLoading || cooldown > 0) return;
    isFetchingRef.current = true;
    setQrLoading(true);
    try {
      const data = await fetchQrCodeWithCreateFallback();
      if (data.connected) {
        setConnected(true);
        setQrcode(null);
      } else {
        setConnected(false);
        setQrcode(data.qrcode);
      }
    } catch (err) {
      setQrcode(null);
      // Detalhe amigável do backend (429/404/502 já vêm legíveis);
      // genérico só como último recurso.
      toast.error(err.message || "Erro ao gerar QR Code. Verifique a conexão com a Evolution API.");
      // Retry-After do servidor quando houver (throttle real do Evo dura
      // minutos); senão, trava local curta anti-duplo-clique.
      const isRateLimited =
        err.status === 429 || /aguarde|muitas tentativas|cooldown/i.test(err.message || "");
      if (isRateLimited) {
        const seconds =
          Number.isFinite(err.retryAfter) && err.retryAfter > 0 ? Math.ceil(err.retryAfter) : 60;
        writeSharedCooldown(seconds);
        setCooldown(seconds);
      }
    } finally {
      setQrLoading(false);
      isFetchingRef.current = false;
    }
  }, [isAdmin, qrLoading, cooldown, toast]);

  // Contagem regressiva do cooldown.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Deriva o estado de conexão do poll único do useSettings (30s):
  // antes havia um segundo poller próprio de 15s batendo no mesmo
  // /settings/status e dobrando a pressão sobre o pool do banco.
  useEffect(() => {
    const isConnected = status?.whatsapp?.state === "open";
    setConnected(!!isConnected);
    if (!isConnected) setQrcode(null);
  }, [status]);

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

          {/* Editor (somente admin; demais só visualizam o status acima) */}
          <textarea
            className={styles.textarea}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={10}
            spellCheck={false}
            readOnly={!isAdmin}
          />

          {/* Ações (somente admin) */}
          {isAdmin && (
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
          )}
        </section>
        {/*Seção QR Code (somente admin) */}
        {isAdmin && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Conexão WhatsApp</h2>
          <p className={styles.sectionDesc}>
            Escaneie o QR Code abaixo com o WhatsApp da escola para conectar o sistema.
          </p>

          <div className={styles.qrcodeSection}>
            {connected ? (
              <>
                <p className={styles.saveSuccess}>WhatsApp conectado.</p>
                <button
                  className={styles.disconnectButton}
                  onClick={() => setShowDisconnectModal(true)}
                  disabled={disconnecting}
                >
                  {disconnecting ? "Desconectando..." : "Desconectar WhatsApp"}
                </button>
              </>
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
              <button
                className={styles.qrcodeButton}
                onClick={loadQrCode}
                disabled={qrLoading || cooldown > 0}
              >
                {qrLoading
                  ? "Carregando..."
                  : cooldown > 0
                    ? `Aguarde ${cooldown}s`
                    : qrcode ? "Atualizar QR Code" : "Gerar QR Code"}
              </button>
            )}
          </div>
        </section>
        )}

        <ConfirmDialog
          open={showDisconnectModal}
          title="Desconectar WhatsApp"
          message="Tem certeza que deseja desconectar o WhatsApp da escola? Será necessário escanear o QR Code novamente para reconectar."
          confirmLabel="Desconectar"
          cancelLabel="Cancelar"
          danger
          onConfirm={handleConfirmDisconnect}
          onCancel={() => setShowDisconnectModal(false)}
        />

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
