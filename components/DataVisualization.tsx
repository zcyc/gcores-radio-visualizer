"use client";

import { useTheme } from "@/lib/contexts/ThemeContext";
import type { RadioProgram } from "@/types/RadioProgram";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface DataVisualizationProps {
  programs: RadioProgram[];
}

// 格式化月份标签的辅助函数
const formatMonthLabel = (monthYear: string): string => {
  try {
    const [year, month] = monthYear.split("-");
    if (!year || !month) return monthYear;

    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
    });
  } catch {
    return monthYear;
  }
};

export const DataVisualization: React.FC<DataVisualizationProps> = ({
  programs,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // 准备图表数据 - 使用综合参与度算法
  const calculateEngagementScore = (program: RadioProgram) => {
    // 综合参与度评分：点赞(权重1) + 评论(权重2) + 收藏(权重3)
    // 评论和收藏的参与成本更高，给予更高权重
    return (
      program["likes-count"] * 1 +
      program["comments-count"] * 2 +
      program["bookmarks-count"] * 3
    );
  };

  const engagementData = programs
    .sort((a, b) => calculateEngagementScore(b) - calculateEngagementScore(a))
    .slice(0, 10)
    .map((program) => ({
      name:
        program.title.length > 20
          ? program.title.substring(0, 20) + "..."
          : program.title,
      likes: program["likes-count"],
      comments: program["comments-count"],
      bookmarks: program["bookmarks-count"],
      engagementScore: calculateEngagementScore(program),
    }));

  const durationDistribution = programs.reduce(
    (acc: { [key: string]: number }, program) => {
      const duration = program.duration;
      let category = "";
      if (duration < 30) category = "< 30分钟";
      else if (duration < 60) category = "30-60分钟";
      else if (duration < 120) category = "60-120分钟";
      else category = "> 120分钟";

      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {},
  );

  const durationData = Object.entries(durationDistribution).map(
    ([name, value]) => ({ name, value }),
  );

  // 按发布时间统计（按月）
  const publishedData = programs.reduce(
    (acc: { [key: string]: number }, program) => {
      try {
        // 清理和验证日期字符串
        const rawDate = program["published-at"];
        if (!rawDate) return acc;

        const cleanDateString = String(rawDate)
          .trim()
          .replace(/^["\']+|["\']+$/g, "");
        if (
          !cleanDateString ||
          cleanDateString === "null" ||
          cleanDateString === "undefined"
        ) {
          return acc;
        }

        const date = new Date(cleanDateString);

        // 检查日期是否有效
        if (isNaN(date.getTime())) {
          return acc;
        }

        // 检查年份是否合理（避免显示过于久远或未来的日期）
        const year = date.getFullYear();
        if (year < 2010 || year > new Date().getFullYear() + 1) {
          return acc;
        }

        const monthYear = `${year}-${String(date.getMonth() + 1).padStart(
          2,
          "0",
        )}`;
        acc[monthYear] = (acc[monthYear] || 0) + 1;
      } catch (error) {
        // 忽略无效日期
        console.warn("Invalid date detected:", program["published-at"]);
      }
      return acc;
    },
    {},
  );

  const timelineData = Object.entries(publishedData)
    .filter(([month, count]) => month !== "NaN-NaN" && count > 0) // 过滤无效数据
    .sort(([a], [b]) => {
      // 按日期排序，确保数据按时间顺序显示
      const dateA = new Date(a + "-01");
      const dateB = new Date(b + "-01");
      return dateA.getTime() - dateB.getTime();
    })
    .slice(-24) // 显示最近24个月，提供更丰富的趋势数据
    .map(([month, count]) => ({
      month: formatMonthLabel(month),
      originalMonth: month,
      count,
    }));

  return (
    <div className="space-y-8">
      {/* 参与度对比 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          热门节目参与度对比（Top 10）
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          按综合参与度排序：点赞×1 + 评论×2 + 收藏×3
        </p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engagementData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#374151" : "#E5E7EB"}
              />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
                tick={{ fill: isDark ? "#D1D5DB" : "#374151" }}
              />
              <YAxis tick={{ fill: isDark ? "#D1D5DB" : "#374151" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#374151" : "#ffffff",
                  border: `1px solid ${isDark ? "#4B5563" : "#E5E7EB"}`,
                  borderRadius: "8px",
                  color: isDark ? "#F9FAFB" : "#111827",
                }}
                formatter={(value, name) => [value.toLocaleString(), name]}
                labelFormatter={(label) => `节目：${label}`}
              />
              <Bar dataKey="likes" fill="#EF4444" name="点赞" />
              <Bar dataKey="comments" fill="#10B981" name="评论" />
              <Bar dataKey="bookmarks" fill="#F59E0B" name="收藏" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 时长分布 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          节目时长分布
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={durationData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#374151" : "#E5E7EB"}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: isDark ? "#D1D5DB" : "#374151" }}
              />
              <YAxis tick={{ fill: isDark ? "#D1D5DB" : "#374151" }} />
              <Tooltip
                formatter={(value) => [value, "节目数"]}
                contentStyle={{
                  backgroundColor: isDark ? "#374151" : "#ffffff",
                  border: `1px solid ${isDark ? "#4B5563" : "#E5E7EB"}`,
                  borderRadius: "8px",
                  color: isDark ? "#F9FAFB" : "#111827",
                }}
              />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 发布时间趋势 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          节目发布趋势（最近24个月）
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#374151" : "#E5E7EB"}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: isDark ? "#D1D5DB" : "#374151" }}
              />
              <YAxis tick={{ fill: isDark ? "#D1D5DB" : "#374151" }} />
              <Tooltip
                formatter={(value) => [value, "节目数"]}
                contentStyle={{
                  backgroundColor: isDark ? "#374151" : "#ffffff",
                  border: `1px solid ${isDark ? "#4B5563" : "#E5E7EB"}`,
                  borderRadius: "8px",
                  color: isDark ? "#F9FAFB" : "#111827",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
