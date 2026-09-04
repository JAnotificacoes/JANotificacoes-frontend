"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useHistory } from "@/hooks/useHistory";
import { searchStudents } from "@/services/api";
import { Badge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import styles from "./history.module.css";

export default function HistoryPage() {
  const { data, loading, error, filters, updateFilter, resetFilters, page, setPage } = useHistory();

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const dropdownRef = useRef(null);

  const fetchSuggestions = useCallback(async (q) => {
    if (q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const data = await searchStudents(q);
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
      setSelectedIndex(-1);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!value) {
      updateFilter("student_name", "");
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
  };

  const handleSelectSuggestion = (suggestion) => {
    setSearchQuery(suggestion.student_name);
    setShowSuggestions(false);
    updateFilter("student_name", suggestion.student_name);
  };

  const handleSearchKeyDown = (e) => {
    if (!showSuggestions) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!filters.student_name) setSearchQuery("");
  }, [filters.student_name]);

  const handleResetFilters = () => {
    resetFilters();
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const columns = [
    { key: "student_name", label: "Aluno" },
    { key: "full_classroom", label: "Turma" },
    { key: "date", label: "Data da falta" },
    {
      key: "status",
      label: "Notificação",
      render: (row) => <Badge status={row.status} />,
    },
    { key: "sent_at", label: "Horário do envio" },
    {
      key: "error",
      label: "Erro",
      render: (row) => row.error
        ? <span className={styles.errorMessage}>{row.error}</span>
        : "—",
    },
  ];

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div>
      <div className={styles.container}>

        {/* Filtros */}
        <div className={styles.filters}>

          <div className={styles.filterGroup}>
            <label className={styles.label}>De</label>
            <input
              type="date"
              className={styles.input}
              value={filters.date_from}
              onChange={(e) => updateFilter("date_from", e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.label}>Até</label>
            <input
              type="date"
              className={styles.input}
              value={filters.date_to}
              onChange={(e) => updateFilter("date_to", e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.label}>Ano</label>
            <select
              className={styles.select}
              value={filters.school_year}
              onChange={(e) => updateFilter("school_year", e.target.value)}
            >
              <option value="">Todos</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((y) => (
                <option key={y} value={String(y)}>{y}º Ano</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.label}>Turma</label>
            <select
              className={styles.select}
              value={filters.classroom}
              onChange={(e) => updateFilter("classroom", e.target.value)}
            >
              <option value="">Todas</option>
              {["A", "B"].map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.label}>Status</label>
            <select
              className={styles.select}
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
            >
              <option value="">Todos</option>
              <option value="sent">Enviada</option>
              <option value="error">Erro</option>
              <option value="pending">Pendente</option>
            </select>
          </div>

          <div className={styles.searchWrapper}>
            <label className={styles.label}>Aluno</label>
            <div className={styles.autocomplete}>
              <input
                ref={inputRef}
                type="search"
                className={styles.searchInput}
                placeholder="Buscar aluno..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                aria-autocomplete="list"
                aria-controls="student-suggestions"
              />
              {showSuggestions && (
                <ul
                  id="student-suggestions"
                  ref={dropdownRef}
                  className={styles.suggestions}
                  role="listbox"
                >
                  {suggestions.map((s, i) => (
                    <li
                      key={s.id}
                      role="option"
                      aria-selected={i === selectedIndex}
                      className={`${styles.suggestionItem} ${i === selectedIndex ? styles.suggestionActive : ""}`}
                      onClick={() => handleSelectSuggestion(s)}
                      onMouseEnter={() => setSelectedIndex(i)}
                    >
                      <span className={styles.suggestionName}>{s.student_name}</span>
                      <span className={styles.suggestionClass}>{s.full_classroom}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {hasActiveFilters && (
            <button className={styles.resetButton} onClick={handleResetFilters}>
              Limpar filtros
            </button>
          )}

        </div>

        {/* Tabela */}
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Histórico de notificações</h2>
            <span className={styles.tableCount}>
              {data.total ?? 0} registros
            </span>
          </div>
          <Table
            columns={columns}
            data={data.items}
            loading={loading}
            empty="Nenhuma notificação encontrada para os filtros selecionados."
          />
        </div>

        {/* Paginação */}
        {data.pages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageButton}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </button>
            <span className={styles.pageInfo}>
              Página {page} de {data.pages}
            </span>
            <button
              className={styles.pageButton}
              onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
              disabled={page === data.pages}
            >
              Próxima
            </button>
          </div>
        )}

        {error && (
          <p className={styles.error}>Erro ao carregar histórico: {error}</p>
        )}

      </div>
    </div>
  );
}