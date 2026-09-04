"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/services/api";
import { useToast } from "@/components/ui/ToastProvider";
import styles from "./register.module.css";

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register({ email, password, full_name: fullName });
      toast.success("Conta de administrador criada com sucesso!");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const msg = err.message || "Erro ao criar conta";
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
          <p className={styles.subtitle}>Criar primeira conta (administrador)</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="full_name" className={styles.label}>
              Nome completo
            </label>
            <input
              id="full_name"
              type="text"
              className={styles.input}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Senha
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              disabled={loading}
              minLength={6}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? "Criando..." : "Criar conta de administrador"}
          </button>
        </form>

        <p className={styles.backLink}>
          <Link href="/login">← Voltar para o login</Link>
        </p>
      </div>
    </div>
  );
}