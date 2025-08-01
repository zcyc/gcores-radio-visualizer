"use client";

import React from "react";
import type { RadioProgram } from "@/types/RadioProgram";
import { ProgramCard } from "@/components/ProgramCard";

interface ProgramListProps {
  programs: RadioProgram[];
  loading?: boolean;
  showPaginationInfo?: boolean;
  currentPage?: number;
  totalPages?: number;
}

export const ProgramList: React.FC<ProgramListProps> = ({
  programs,
  loading,
  showPaginationInfo = false,
  currentPage = 1,
  totalPages = 1,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse border border-gray-200 dark:border-gray-700"
          >
            <div className="aspect-video w-full bg-gray-300 dark:bg-gray-600"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-3"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🎧</div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">暂无节目数据</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
          请检查网络连接或稍后重试
        </p>
      </div>
    );
  }

  return (
    <div>
      {showPaginationInfo && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          第 {currentPage} 页，共 {totalPages} 页
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
    </div>
  );
};
