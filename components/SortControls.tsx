"use client";

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import React from "react";

export type SortField =
  | "title"
  | "published-at"
  | "likes-count"
  | "comments-count"
  | "bookmarks-count"
  | "duration";
export type SortDirection = "asc" | "desc";

interface SortOption {
  field: SortField;
  label: string;
}

interface SortControlsProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
}

const sortOptions: SortOption[] = [
  { field: "published-at", label: "发布时间" },
  { field: "likes-count", label: "点赞数" },
  { field: "comments-count", label: "评论数" },
  { field: "bookmarks-count", label: "收藏数" },
  { field: "duration", label: "时长" },
  { field: "title", label: "标题" },
];

export const SortControls: React.FC<SortControlsProps> = ({
  sortField,
  sortDirection,
  onSortChange,
}) => {
  const handleSortFieldChange = (field: SortField) => {
    if (field === sortField) {
      // 如果点击的是当前排序字段，则切换排序方向
      onSortChange(field, sortDirection === "asc" ? "desc" : "asc");
    } else {
      // 如果点击的是不同字段，使用默认排序方向
      const defaultDirection: SortDirection =
        field === "title" ? "asc" : "desc";
      onSortChange(field, defaultDirection);
    }
  };

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) {
      return (
        <ArrowUpDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      );
    }

    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        排序方式
      </h3>
      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => {
          const isActive = option.field === sortField;
          return (
            <button
              key={option.field}
              onClick={() => handleSortFieldChange(option.field)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-600"
                  : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
              }`}
            >
              <span>{option.label}</span>
              {getSortIcon(option.field)}
            </button>
          );
        })}
      </div>

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        当前排序：{sortOptions.find((opt) => opt.field === sortField)?.label}(
        {sortDirection === "asc" ? "升序" : "降序"})
      </div>
    </div>
  );
};
