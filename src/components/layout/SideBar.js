"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "@/components/layout/sidebar.module.css";

const navItems = [
  { href: "/dashboard", label: "Dashboard",      icon: "📊" },
  { href: "/history",   label: "Histórico",       icon: "📋" },
  { href: "/settings",  label: "Configurações",   icon: "⚙️" },
  { href: "/about",     label: "Sobre",            icon: "ℹ️" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>

      <div className={styles.brand}>
        <div className={styles.brandMark}>
          <Image
            src="/logo.png"
            alt="logo do Joao Alves"
            placeholder="blur"
            blurDataURL="..."
            width={256}
            height={256}
            loading="eager"
          />
        </div>
        <p className={styles.brandSub}>Painel da Coordenação</p>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <p className={styles.footerText}>JANotifica v1.0.0</p>
      </div>

    </aside>
  );
}