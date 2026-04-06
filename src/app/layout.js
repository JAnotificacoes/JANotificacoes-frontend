import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/layout/SideBar";
import { Header } from "@/components/layout/Header";
import styles from "./layout.module.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "JANotifica - Painel da Coordenação",
  description: "Sistema de notificação de faltas escolares",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <div className={styles.shell}>
          {/* Sidebar fixa à esquerda */}
          <Sidebar />
          {/* Conteúdo principal */}
          <div className={styles.content}>
            <Header />
            <main className={styles.main}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
