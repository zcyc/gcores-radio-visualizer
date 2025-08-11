"use client";

import { SimpleImageProxy } from "@/components/SimpleImageProxy";
import { formatDuration, formatDate } from "@/lib/services/dataService";
import type { RadioProgram } from "@/types/RadioProgram";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Clock,
  ExternalLink,
} from "lucide-react";
import React from "react";

interface ProgramCardProps {
  program: RadioProgram;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  // 选择最优图片源（按优先级）
  const getImageFilename = () => {
    return program.cover || program.thumb || program["app-cover"] || null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg dark:hover:shadow-2xl transition-all duration-200 overflow-hidden h-full flex flex-col border border-gray-200 dark:border-gray-700">
      {/* 封面图片 */}
      <div className="aspect-video w-full overflow-hidden bg-gray-200">
        <SimpleImageProxy
          filename={getImageFilename()}
          alt={program.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* 内容区域 */}
      <div className="p-4 flex flex-col flex-1">
        {/* 上部内容：标题和描述 */}
        <div className="flex-1">
          {/* 标题 */}
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 leading-tight">
            {program.title}
          </h3>

          {/* 描述 */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3 leading-relaxed">
            {program.desc || program.excerpt}
          </p>
        </div>

        {/* 底部固定内容 */}
        <div className="mt-auto space-y-3">
          {/* 统计信息 */}
          <div className="space-y-2">
            {/* 参与度数据 */}
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{program["likes-count"].toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{program["comments-count"].toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bookmark className="w-4 h-4" />
                <span>{program["bookmarks-count"].toLocaleString()}</span>
              </div>
            </div>
            {/* 时长信息 */}
            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(program.duration)}</span>
            </div>
          </div>

          {/* 发布日期和链接 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatDate(program["published-at"])}
            </span>
            <a
              href={program.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              <span className="text-sm">立即收听</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2">
            {program["is-verified"] === "true" && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs rounded-full">
                已验证
              </span>
            )}
            {program["option-is-official"] === "true" && (
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                官方
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
