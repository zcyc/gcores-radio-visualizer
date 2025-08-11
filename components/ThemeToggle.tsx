"use client";

import { useTheme } from "@/lib/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";
import React from "react";

export const ThemeToggle: React.FC = () => {
  const { toggleTheme, isDark, mounted } = useTheme();

  // 在组件未挂载时显示默认样式，避免 hydration 错误
  if (!mounted) {
    return (
      <button
        className="
          relative inline-flex items-center justify-center
          w-10 h-10 rounded-lg
          bg-gray-100 text-gray-600 border border-gray-300
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white
        "
        aria-label="主题切换"
        title="主题切换"
        disabled
      >
        <div className="relative w-5 h-5">
          <Sun className="absolute inset-0 w-5 h-5" />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center
        w-10 h-10 rounded-lg
        transition-all duration-200 ease-in-out
        ${
          isDark
            ? "bg-gray-800 text-yellow-400 hover:bg-gray-700 border border-gray-600"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300"
        }
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isDark ? "focus:ring-offset-gray-900" : "focus:ring-offset-white"}
      `}
      aria-label={isDark ? "切换到浅色模式" : "切换到暗黑模式"}
      title={isDark ? "切换到浅色模式" : "切换到暗黑模式"}
    >
      <div className="relative w-5 h-5">
        {/* 太阳图标 */}
        <Sun
          className={`
            absolute inset-0 w-5 h-5 transition-all duration-300 transform
            ${
              isDark
                ? "rotate-90 scale-0 opacity-0"
                : "rotate-0 scale-100 opacity-100"
            }
          `}
        />

        {/* 月亮图标 */}
        <Moon
          className={`
            absolute inset-0 w-5 h-5 transition-all duration-300 transform
            ${
              isDark
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-0 opacity-0"
            }
          `}
        />
      </div>
    </button>
  );
};
