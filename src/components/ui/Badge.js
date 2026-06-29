import styles from "./badge.module.css";

const ICONS = {
  sent: "\u2713",
  error: "\u2717",
  pending: "\u23F1",
  online: "\u2713",
  offline: "\u2717",
};

export function Badge({ status }) {
  const variants = {
    sent: styles.sent, error: styles.error, pending: styles.pending,
    online: styles.online, offline: styles.offline,
    automatic: styles.automatic, manual: styles.manual,
  };
  const labels = {
    sent: "Enviada", error: "Erro", pending: "Pendente",
    online: "Online", offline: "Offline",
    automatic: "Automática", manual: "Manual",
  };
  const style = variants[status] || styles.default;
  const label = labels[status] || status;
  const icon = ICONS[status] || null;

  return (
    <span className={`${styles.badge} ${style}`}>
      {icon && <span aria-hidden="true">{icon}</span>}
      {label}
    </span>
  );
}
