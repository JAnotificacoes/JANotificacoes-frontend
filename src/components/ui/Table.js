import styles from "./table.module.css";

const SKELETON_ROWS = 5;
const SKELETON_COLUMNS = 6;

function SkeletonRow() {
  return (
    <tr className={styles.tr}>
      {Array.from({ length: SKELETON_COLUMNS }).map((_, i) => (
        <td key={i} className={styles.td}>
          <div className={styles.skeleton} style={{ width: `${40 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function Table({ columns, data, loading, empty = "Nenhum registro encontrado." }) {
  if (loading) {
    return (
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.theadRow}>
              {columns.map(col => (
                <th key={col.key} className={styles.th}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className={styles.empty}>{empty}</div>;
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.theadRow}>
            {columns.map(col => (
              <th key={col.key} className={styles.th}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.absence_id ?? row.student_id ?? i} className={styles.tr}>
              {columns.map(col => (
                <td key={col.key} className={styles.td}>
                  {col.render ? col.render(row) : row[col.key] ?? "\u2014"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
