"use client";

import { usePathname } from "next/navigation";
import styles from "./header.module.css";

// Mapeia cada rota para um título e subtítulo exibidos no cabeçalho
const pageTitles = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Acompanhe as faltas e notificações do dia",
  },
  "/history": {
    title: "Histórico",
    subtitle: "Consulte faltas e notificações anteriores",
  },
  "/settings": {
    title: "Configurações",
    subtitle: "Status das integrações do sistema",
  },
  "/about": {
    title: "Sobre",
    subtitle: "Informações sobre o projeto e contato",
  }
};

export function Header({ children }) {
  const pathname = usePathname();
  const page = pageTitles[pathname] || { title: "", subtitle: "" };

  return (
    <header className={styles.header}>
      <div className={styles.titleGroup}>
        <h1 className={styles.title}>{page.title}</h1>
        <p className={styles.subtitle}>{page.subtitle}</p>
      </div>

      {/* Slot para botões de ação específicos de cada página
          ex: botão "Executar scan" no dashboard */}
      <div className={styles.actions}>
        {children}
      </div>
    </header>
  );
}