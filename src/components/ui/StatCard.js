import styles from "./statCard.module.css";

export function StatCard({ title, value, color }) {
  const colorClass = styles[color] || styles.blue;
  return (
    <div className={`${styles.container} ${colorClass}`}>
      <div className={styles.value}>{value}</div>
      <div className={styles.title}>{title}</div>
    </div>
  );
}
