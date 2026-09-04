"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./SideBar";
import { Header } from "./Header";
import styles from "./shell-layout.module.css";

const AUTH_ROUTES = ["/", "/login", "/auth/register", "/auth/change-password"];

export function ShellLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_ROUTES.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
