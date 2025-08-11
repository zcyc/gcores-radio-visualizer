import type { RadioProgram } from "@/types/RadioProgram";
import type { SortField, SortDirection } from "@/types/SortTypes";
import { useMemo } from "react";

export const useSortedPrograms = (
  programs: RadioProgram[],
  sortField: SortField,
  sortDirection: SortDirection,
) => {
  return useMemo(() => {
    const sorted = [...programs].sort((a, b) => {
      let valueA: string | number | Date;
      let valueB: string | number | Date;

      switch (sortField) {
        case "title":
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case "published-at":
          // 清理日期字符串中的引号
          const cleanDateA =
            a["published-at"]
              ?.toString()
              .replace(/^"+|"+$/g, "")
              .trim() || "";
          const cleanDateB =
            b["published-at"]
              ?.toString()
              .replace(/^"+|"+$/g, "")
              .trim() || "";
          valueA = new Date(cleanDateA);
          valueB = new Date(cleanDateB);
          break;
        case "likes-count":
          valueA = a["likes-count"];
          valueB = b["likes-count"];
          break;
        case "comments-count":
          valueA = a["comments-count"];
          valueB = b["comments-count"];
          break;
        case "bookmarks-count":
          valueA = a["bookmarks-count"];
          valueB = b["bookmarks-count"];
          break;
        case "duration":
          valueA = a.duration;
          valueB = b.duration;
          break;
        default:
          return 0;
      }

      let comparison = 0;

      if (valueA < valueB) {
        comparison = -1;
      } else if (valueA > valueB) {
        comparison = 1;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [programs, sortField, sortDirection]);
};
