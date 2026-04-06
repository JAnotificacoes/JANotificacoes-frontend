import { useState, useEffect, useCallback } from "react";
import { fetchHistory } from "@/services/api";

export function useHistory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros que o coordenador pode aplicar na tela de histórico
  const [filters, setFilters] = useState({
    date_from: "",
    date_to: "",
    classroom: "",
    status: "",
  });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchHistory(filters);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Recarrega os dados sempre que os filtros mudarem
  useEffect(() => {
    load();
  }, [load]);

  // Atualiza um filtro específico sem apagar os outros
  // ex: updateFilter("classroom", "A") mantém os outros filtros intactos
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ date_from: "", date_to: "", classroom: "", status: "" });
  }, []);

  return { data, loading, error, filters, updateFilter, resetFilters };
}