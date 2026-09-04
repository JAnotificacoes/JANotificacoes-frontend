"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";
import { me, listUsers, createUser, deleteUser, toggleAdmin } from "@/services/api";
import styles from "./users.module.css";

function Icon({ d, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  shieldOff: "M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18 M4.73 4.73L4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38 M1 1l22 22",
  trash: "M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  plus: "M12 5v14 M5 12h14",
};

export default function UsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", full_name: "", password: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await me();
        if (!data.is_admin) {
          router.push("/dashboard");
          return;
        }
        setUser(data);
      } catch {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  const loadUsers = useCallback(async () => {
    try {
      const data = await listUsers();
      setUsers(data);
    } catch {
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    if (user?.is_admin) {
      setLoading(false);
      loadUsers();
    }
  }, [user, loadUsers]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createUser(newUser);
      toast.success("Usuário criado com sucesso!");
      setNewUser({ email: "", full_name: "", password: "" });
      setShowModal(false);
      loadUsers();
    } catch (err) {
      toast.error(err.message || "Erro ao criar usuário");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm("Tem certeza que deseja remover este usuário?")) return;
    try {
      await deleteUser(userId);
      toast.success("Usuário removido com sucesso!");
      loadUsers();
    } catch (err) {
      toast.error(err.message || "Erro ao remover usuário");
    }
  };

  const handleToggleAdmin = async (userId, currentIsAdmin) => {
    try {
      await toggleAdmin(userId);
      toast.success(currentIsAdmin ? "Privilégios de admin removidos" : "Usuário promovido a admin");
      loadUsers();
    } catch (err) {
      toast.error(err.message || "Erro ao alterar permissão");
    }
  };

  if (!user) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Usuários</h1>
          <p className={styles.subtitle}>Gerencie os usuários do sistema</p>
        </div>
        <button className={styles.addButton} onClick={() => setShowModal(true)}>
          <Icon d={ICONS.plus} /> Novo usuário
        </button>
      </div>

      {loading ? (
        <p className={styles.loadingText}>Carregando usuários...</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Perfil</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.full_name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`${styles.badge} ${u.is_admin ? styles.badgeAdmin : styles.badgeUser}`}>
                      {u.is_admin ? "Admin" : "Usuário"}
                    </span>
                  </td>
                  <td>{new Date(u.created_at).toLocaleDateString("pt-BR")}</td>
                  <td className={styles.actionsCell}>
                    <button
                      className={styles.iconButton}
                      onClick={() => handleToggleAdmin(u.id, u.is_admin)}
                      disabled={u.id === user.user_id}
                      title={u.is_admin ? "Remover admin" : "Tornar admin"}
                    >
                      <Icon d={u.is_admin ? ICONS.shieldOff : ICONS.shield} />
                    </button>
                    <button
                      className={`${styles.iconButton} ${styles.danger}`}
                      onClick={() => handleDelete(u.id)}
                      disabled={u.id === user.user_id}
                      title="Remover usuário"
                    >
                      <Icon d={ICONS.trash} />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className={styles.emptyText}>Nenhum usuário encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Novo usuário</h3>
            <form onSubmit={handleCreate}>
              <div className={styles.modalField}>
                <label htmlFor="new_user_name">Nome completo</label>
                <input
                  id="new_user_name"
                  type="text"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  required
                  disabled={creating}
                />
              </div>
              <div className={styles.modalField}>
                <label htmlFor="new_user_email">Email</label>
                <input
                  id="new_user_email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                  disabled={creating}
                />
              </div>
              <div className={styles.modalField}>
                <label htmlFor="new_user_password">Senha temporária</label>
                <input
                  id="new_user_password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  minLength={6}
                  disabled={creating}
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.modalCancel} onClick={() => setShowModal(false)} disabled={creating}>
                  Cancelar
                </button>
                <button type="submit" className={styles.modalSubmit} disabled={creating}>
                  {creating ? "Criando..." : "Criar usuário"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
