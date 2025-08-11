import { useState, useMemo } from "react";

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
}

export const usePagination = <T>(
  data: T[],
  initialItemsPerPage: number = 12,
): PaginatedData<T> => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage);

  const paginatedData = useMemo(() => {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const items = data.slice(startIndex, endIndex);

    return {
      items,
      totalItems,
      totalPages,
      startIndex,
      endIndex,
    };
  }, [data, currentPage, itemsPerPage]);

  const setCurrentPageSafe = (page: number) => {
    const maxPage = paginatedData.totalPages || 1;
    const newPage = Math.max(1, Math.min(page, maxPage));
    setCurrentPage(newPage);
  };

  const setItemsPerPage = (newItemsPerPage: number) => {
    // 计算当前第一个项目的索引
    const currentFirstItemIndex = (currentPage - 1) * itemsPerPage;

    // 计算新的页码，使得尽可能保持在相同的数据区域
    const newPage = Math.floor(currentFirstItemIndex / newItemsPerPage) + 1;

    setItemsPerPageState(newItemsPerPage);
    setCurrentPageSafe(newPage);
  };

  return {
    items: paginatedData.items,
    pagination: {
      currentPage,
      totalPages: paginatedData.totalPages,
      itemsPerPage,
      totalItems: paginatedData.totalItems,
      hasNextPage: currentPage < paginatedData.totalPages,
      hasPreviousPage: currentPage > 1,
    },
    setCurrentPage: setCurrentPageSafe,
    setItemsPerPage,
  };
};
