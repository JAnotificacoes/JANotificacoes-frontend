import styles from "./badge.module.css";

export function Badge({ status }) {
  // Mapeia cada status para um conjunto de classes Tailwind
  // Centraliza o estilo dos badges num lugar só —
  // se precisar mudar a cor de "sent", muda aqui e reflete em toda a aplicação
  const variants = {
    sent:      styles.sent,
    error:     styles.error,
    pending:   styles.pending,
    online:    styles.online,
    offline:   styles.offline,
    automatic: styles.automatic,
    manual:    styles.manual,
  };

  // Labels em português para exibição
  const labels = {
    sent:      "Enviada",
    error:     "Erro",
    pending:   "Pendente",
    online:    "Online",
    offline:   "Offline",
    automatic: "Automático",
    manual:    "Manual",
  };

  const style = variants[status] || styles.default;
  const label = labels[status] || status;

  return (
    <span className={`${styles.badge} ${style}`}>
      {label}
    </span> 
  );
}