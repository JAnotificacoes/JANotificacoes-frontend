"use client";
import { usePathname } from "next/navigation";
import styles from "./header.module.css";

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const pageTitles = {
  "/dashboard": { title: "Dashboard", subtitle: "Acompanhe as faltas do dia" },
  "/history":   { title: "Histórico",  subtitle: "Consulte faltas e notificações anteriores" },
  "/settings":  { title: "Configurações", subtitle: "Status das integrações do sistema" },
  "/about":     { title: "Sobre",      subtitle: "Informações sobre o projeto e contato" },
};

function DayBadge() {
  const now = new Date();
  const month = MONTHS[now.getMonth()];
  const day = String(now.getDate()).padStart(2, "0");

  return (
    <div className={styles.dayBadge} aria-label={`Data atual: ${day} de ${month}`}>
      <span className={styles.dayBadgeMonth}>{month}</span>
      <span className={styles.dayBadgeDay}>{day}</span>
    </div>
  );
}

export function Header({ children }) {
  const pathname = usePathname();
  const page = pageTitles[pathname] || { title: "", subtitle: "" };
  const showBadge = pathname === "/dashboard";

  return (
    <header className={styles.header}>
      <div className={styles.titleGroup}>
        <h1 className={styles.title}>{page.title}</h1>
        <p className={styles.subtitle}>{page.subtitle}</p>
      </div>
      <div className={styles.actions}>
        {showBadge && <DayBadge />}
        {children}
      </div>
    </header>
  );
}
