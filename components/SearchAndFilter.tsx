"use client";

import type { FilterOptions } from "@/types/FilterOptions";
import { Search, Filter, X } from "lucide-react";
import { useState } from "react";

interface SearchAndFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  filters,
  onFiltersChange,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (
    key: keyof FilterOptions,
    value: string | number,
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      searchQuery: "",
      isOfficial: "",
      isVerified: "",
      minLikes: 0,
      minDuration: 0,
      maxDuration: 0,
    });
  };

  const hasActiveFilters =
    filters.searchQuery ||
    filters.minLikes > 0 ||
    filters.minDuration > 0 ||
    filters.maxDuration > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-200">
      {/* 搜索框和高级筛选在同一行 */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
        {/* 搜索框 */}
        <div className="relative flex-1 order-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="搜索节目标题或描述..."
            value={filters.searchQuery}
            onChange={(e) => handleInputChange("searchQuery", e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 transition-colors"
          />
        </div>

        {/* 高级筛选按钮 */}
        <div className="flex items-center space-x-3 order-2 sm:order-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:text-gray-200 transition-colors whitespace-nowrap"
          >
            <Filter className="w-4 h-4" />
            <span>高级筛选</span>
            <span
              className={`transform transition-transform ${
                showAdvanced ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {/* 清除筛选按钮 */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center space-x-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors whitespace-nowrap"
            >
              <X className="w-4 h-4" />
              <span>清除</span>
            </button>
          )}
        </div>
      </div>

      {/* 高级筛选选项 */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
          {/* 最低点赞数 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              最低点赞数
            </label>
            <input
              type="number"
              min="0"
              value={filters.minLikes}
              onChange={(e) =>
                handleInputChange("minLikes", parseInt(e.target.value) || 0)
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 transition-colors"
              placeholder="0"
            />
          </div>

          {/* 最短时长 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              最短时长(分钟)
            </label>
            <input
              type="number"
              min="0"
              value={filters.minDuration}
              onChange={(e) =>
                handleInputChange("minDuration", parseInt(e.target.value) || 0)
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 transition-colors"
              placeholder="0"
            />
          </div>

          {/* 最长时长 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              最长时长(分钟)
            </label>
            <input
              type="number"
              min="0"
              value={filters.maxDuration}
              onChange={(e) =>
                handleInputChange("maxDuration", parseInt(e.target.value) || 0)
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 transition-colors"
              placeholder="不限"
            />
          </div>
        </div>
      )}
    </div>
  );
};
