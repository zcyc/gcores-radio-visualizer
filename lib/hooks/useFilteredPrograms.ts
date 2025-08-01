import { useMemo } from "react";
import type { RadioProgram } from "@/types/RadioProgram";
import type { FilterOptions } from "@/types/FilterOptions";

export const useFilteredPrograms = (
  programs: RadioProgram[],
  filters: FilterOptions,
) => {
  return useMemo(() => {
    let filtered = [...programs];

    // 搜索查询
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (program) =>
          program.title.toLowerCase().includes(query) ||
          program.desc.toLowerCase().includes(query) ||
          program.excerpt.toLowerCase().includes(query),
      );
    }

    // 最低点赞数
    if (filters.minLikes > 0) {
      filtered = filtered.filter(
        (program) => program["likes-count"] >= filters.minLikes,
      );
    }

    // 时长范围
    if (filters.minDuration > 0) {
      filtered = filtered.filter(
        (program) => program.duration >= filters.minDuration,
      );
    }

    if (filters.maxDuration > 0) {
      filtered = filtered.filter(
        (program) => program.duration <= filters.maxDuration,
      );
    }

    return filtered;
  }, [programs, filters]);
};
