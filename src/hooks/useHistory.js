import { useState, useEffect, useCallback } from "react";
import { fetchHistory } from "@/services/api";

export function useHistory() {
  const [data, setData] = useState({ items: [], total: 0, pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  // Filtros que o coordenador pode aplicar na tela de histórico
  const [filters, setFilters] = useState({
    date_from: "",
    date_to:   "",
    classroom: "",
    status:    "",
  });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchHistory({ ...filters, page, page_size: 20 });
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  // Recarrega os dados sempre que os filtros mudarem
  useEffect(() => {
    load();
  }, [load]);

  // Atualiza um filtro específico sem apagar os outros
  // ex: updateFilter("classroom", "A") mantém os outros filtros intactos
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // volta pra página 1 ao filtrar
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ date_from: "", date_to: "", classroom: "", status: "" });
    setPage(1);
  }, []);

  return { data, loading, error, filters, updateFilter, resetFilters, page, setPage };
}