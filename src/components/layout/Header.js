"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { logout, me } from "@/services/api";
import { useToast } from "@/components/ui/ToastProvider";
import styles from "./header.module.css";

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const pageTitles = {
  "/dashboard": { title: "Dashboard", subtitle: "Acompanhe as faltas do dia" },
  "/history":   { title: "Histórico",  subtitle: "Consulte faltas e notificações anteriores" },
  "/users":     { title: "Usuários",   subtitle: "Gerencie os usuários do sistema" },
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
  const router = useRouter();
  const { toast } = useToast();
  const page = pageTitles[pathname] || { title: "", subtitle: "" };
  const showBadge = pathname === "/dashboard";

  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await me();
        setUser(data);
      } catch {
        setUser(null);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout realizado com sucesso");
      router.push("/login");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Erro ao fazer logout");
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.titleGroup}>
        <h1 className={styles.title}>{page.title}</h1>
        <p className={styles.subtitle}>{page.subtitle}</p>
      </div>
      <div className={styles.actions}>
        {showBadge && <DayBadge />}
        {children}
        {user && (
          <div className={styles.userMenu}>
            <button
              className={styles.userButton}
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-expanded={showUserMenu}
              aria-haspopup="true"
            >
              <span className={styles.userName}>{user.full_name}</span>
              <span className={styles.userEmail}>{user.email}</span>
              <span className={styles.chevron}>{showUserMenu ? "▲" : "▼"}</span>
            </button>
            {showUserMenu && (
              <div className={styles.userDropdown}>
                <div className={styles.userInfo}>
                  <span className={styles.userRole}>{user.is_admin ? "Administrador" : "Usuário"}</span>
                </div>
                <button className={styles.logoutButton} onClick={handleLogout}>
                  Sair
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
