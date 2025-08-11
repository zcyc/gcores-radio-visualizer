"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 始终从 'light' 开始，避免 hydration 不一致
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // 组件挂载后再读取 localStorage 和系统偏好
  useEffect(() => {
    setMounted(true);

    // 读取保存的主题偏好
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    } else {
      // 如果没有保存的偏好，检查系统偏好
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  // 切换主题函数
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // 当主题改变时，更新DOM和localStorage
  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;

    // 移除之前的主题类
    root.classList.remove("light", "dark");

    // 添加新的主题类
    root.classList.add(theme);

    // 保存到localStorage
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const value = {
    theme,
    toggleTheme,
    isDark: theme === "dark",
    mounted,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
