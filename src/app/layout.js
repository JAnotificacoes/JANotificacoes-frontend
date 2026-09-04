import { Geist } from "next/font/google";
import { ShellLayout } from "@/components/layout/ShellLayout";
import { ToastProvider } from "@/components/ui/ToastProvider";
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
        <ShellLayout>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ShellLayout>
      </body>
    </html>
  );
}
