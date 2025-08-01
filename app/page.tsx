"use client";

import { useState, useEffect } from "react";
import { BarChart3, List, RefreshCw } from "lucide-react";
import type { RadioProgram, RadioProgramStats } from "@/types/RadioProgram";
import { fetchRadioPrograms, calculateStats } from "@/lib/services/dataService";
import { StatsOverview } from "@/components/StatsOverview";
import { SearchAndFilter } from "@/components/SearchAndFilter";
import type { FilterOptions } from "@/types/FilterOptions";
import {
  SortControls,
  type SortField,
  type SortDirection,
} from "@/components/SortControls";
import { ProgramList } from "@/components/ProgramList";
import { DataVisualization } from "@/components/DataVisualization";
import { Pagination } from "@/components/Pagination";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useFilteredPrograms } from "@/lib/hooks/useFilteredPrograms";
import { useSortedPrograms } from "@/lib/hooks/useSortedPrograms";
import { usePagination } from "@/lib/hooks/usePagination";

export default function HomePage() {
  const [programs, setPrograms] = useState<RadioProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<RadioProgramStats>({
    totalPrograms: 0,
    totalLikes: 0,
    totalComments: 0,
    totalBookmarks: 0,
    averageDuration: 0,
  });
  const [activeTab, setActiveTab] = useState<"list" | "charts">("list");
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: "",
    isOfficial: "",
    isVerified: "",
    minLikes: 0,
    minDuration: 0,
    maxDuration: 0,
  });
  const [sortField, setSortField] = useState<SortField>("bookmarks-count");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filteredPrograms = useFilteredPrograms(programs, filters);
  const sortedAndFilteredPrograms = useSortedPrograms(
    filteredPrograms,
    sortField,
    sortDirection,
  );
  const paginatedData = usePagination(sortedAndFilteredPrograms, 12);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRadioPrograms();
      setPrograms(data);
      setStats(calculateStats(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载数据失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center transition-colors duration-200">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            数据加载失败
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>重新加载</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 左侧：Logo和标题 */}
            <div className="flex items-center space-x-4">
              <div className="text-2xl">🎧</div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  GCores 电台数据可视化
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  展示电台节目数据和参与度统计
                </p>
              </div>
            </div>

            {/* 中间：Tab切换 */}
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 transition-colors duration-200">
              <button
                onClick={() => setActiveTab("list")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "list"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">节目列表</span>
              </button>
              <button
                onClick={() => setActiveTab("charts")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "charts"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">数据图表</span>
              </button>
            </div>

            {/* 右侧：主题切换和刷新按钮 */}
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <button
                onClick={loadData}
                disabled={loading}
                className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">刷新</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计概览 */}
        <StatsOverview stats={stats} />

        {/* 内容区域 */}
        {activeTab === "list" ? (
          <>
            {/* 搜索和筛选 */}
            <SearchAndFilter filters={filters} onFiltersChange={setFilters} />

            {/* 排序控制 */}
            <SortControls
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
            />

            {/* 分页 */}
            <Pagination
              currentPage={paginatedData.pagination.currentPage}
              totalPages={paginatedData.pagination.totalPages}
              onPageChange={paginatedData.setCurrentPage}
              itemsPerPage={paginatedData.pagination.itemsPerPage}
              onItemsPerPageChange={paginatedData.setItemsPerPage}
              totalItems={paginatedData.pagination.totalItems}
            />

            {/* 节目列表 */}
            <div className="my-6">
              <ProgramList
                programs={paginatedData.items}
                loading={loading}
                showPaginationInfo={true}
                currentPage={paginatedData.pagination.currentPage}
                totalPages={paginatedData.pagination.totalPages}
              />
            </div>

            {/* 底部分页 */}
            {paginatedData.pagination.totalPages > 1 && (
              <Pagination
                currentPage={paginatedData.pagination.currentPage}
                totalPages={paginatedData.pagination.totalPages}
                onPageChange={paginatedData.setCurrentPage}
                itemsPerPage={paginatedData.pagination.itemsPerPage}
                onItemsPerPageChange={paginatedData.setItemsPerPage}
                totalItems={paginatedData.pagination.totalItems}
              />
            )}

            {/* 筛选信息 */}
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
              {filteredPrograms.length !== programs.length ? (
                <span>
                  已筛选 {filteredPrograms.length} 个节目（共 {programs.length}{" "}
                  个）
                </span>
              ) : (
                <span>共 {programs.length} 个节目</span>
              )}
            </div>
          </>
        ) : (
          /* 数据可视化 */
          <DataVisualization programs={programs} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              数据来源：
              <a
                href="https://github.com/jerryshell/gcores-best-radio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                GCores Best Radio
              </a>
            </p>
            <p className="mt-2">使用 Next.js + Tailwind CSS + Recharts 构建</p>

            {/* 作者 GitHub 链接 */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <p className="mb-2 font-medium text-gray-600 dark:text-gray-300">
                项目作者
              </p>
              <div className="flex items-center justify-center space-x-6">
                <a
                  href="https://github.com/zcyc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    zcyc
                  </span>
                </a>
                <a
                  href="https://github.com/jerryshell"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    jerryshell
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
