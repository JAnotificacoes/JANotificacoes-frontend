import { Geist } from "next/font/google";
import { Sidebar } from "@/components/layout/SideBar";
import { Header } from "@/components/layout/Header";
import { ToastProvider } from "@/components/ui/ToastProvider";
import styles from "./layout.module.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
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
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body>
        <div className={styles.shell}>
          {/* Sidebar fixa à esquerda */}
          <Sidebar />
          {/* Conteúdo principal */}
          <div className={styles.content}>
            <Header />
            <main className={styles.main}>
              <ToastProvider>
                {children}
              </ToastProvider>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
