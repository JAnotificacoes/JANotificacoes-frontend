"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { changePassword, me } from "@/services/api";
import { useToast } from "@/components/ui/ToastProvider";
import styles from "./changePassword.module.css";

export const dynamic = 'force-dynamic';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("As novas senhas não coincidem");
      return;
    }

    if (newPassword.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Senha alterada com sucesso!");
      router.push("/dashboard");
    } catch (err) {
      const msg = err.message || "Erro ao alterar senha";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img src="/logo.png" alt="JANotifica" className={styles.logo} />
          <h1 className={styles.title}>
            JA<span className={styles.highlight}>notifica</span>
          </h1>
          <p className={styles.subtitle}>Alterar senha</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="current_password" className={styles.label}>
              Senha atual
            </label>
            <input
              id="current_password"
              type="password"
              className={styles.input}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="new_password" className={styles.label}>
              Nova senha
            </label>
            <input
              id="new_password"
              type="password"
              className={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
              disabled={loading}
              minLength={6}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirm_password" className={styles.label}>
              Confirmar nova senha
            </label>
            <input
              id="confirm_password"
              type="password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              disabled={loading}
              minLength={6}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? "Salvando..." : "Alterar senha"}
          </button>
        </form>

        <p className={styles.backLink}>
          <a href="/dashboard" onClick={(e) => { e.preventDefault(); router.push("/dashboard"); }}>
            ← Voltar ao dashboard
          </a>
        </p>
      </div>
    </div>
  );
}