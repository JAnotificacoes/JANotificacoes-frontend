"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import styles from "./toast.module.css";

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timersRef.current[id]);
    delete timersRef.current[id];
  }, []);

  const add = useCallback((message, type = "info", duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    timersRef.current[id] = setTimeout(() => remove(id), duration);
    return id;
  }, [remove]);

  const toast = useCallback(
    (message, type, duration) => add(message, type, duration),
    [add],
  );

  toast.success = useCallback(
    (msg, duration) => add(msg, "success", duration ?? 4000),
    [add],
  );

  toast.error = useCallback(
    (msg, duration) => add(msg, "error", duration ?? 6000),
    [add],
  );

  toast.info = useCallback(
    (msg, duration) => add(msg, "info", duration ?? 4000),
    [add],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className={styles.container} aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${styles[t.type] || styles.info}`}
            role="alert"
          >
            <span className={styles.message}>{t.message}</span>
            <button
              className={styles.dismiss}
              onClick={() => remove(t.id)}
              aria-label="Fechar"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
