import { usePaginated } from "@/hooks/usePagination";
import { fetchHistory } from "@/services/api";

const initialFilters = {
  date_from: "",
  date_to: "",
  school_year: "",
  classroom: "",
  status: "",
  student_name: "",
};

export function useHistory() {
  return usePaginated(fetchHistory, initialFilters);
}