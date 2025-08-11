"use client";

import React from "react";

interface SimpleImageProxyProps {
  filename: string | null | undefined;
  alt: string;
  className?: string;
}

export const SimpleImageProxy: React.FC<SimpleImageProxyProps> = ({
  filename,
  alt,
  className = "",
}) => {
  // 处理文件名
  const cleanFilename = filename?.trim().replace(/^"+|"+$/g, "") || "";

  if (!cleanFilename || cleanFilename === "null") {
    return (
      <div
        className={`${className} bg-gray-200 flex items-center justify-center`}
      >
        <span className="text-gray-500 text-sm">封面未找到</span>
      </div>
    );
  }

  // 生成代理URL
  const originalUrl = `https://image.gcores.com/${cleanFilename}`;
  const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(
    originalUrl,
  )}`;

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    // 如果代理失败，尝试另一个代理
    if (img.src === proxyUrl) {
      const fallbackUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
        originalUrl,
      )}`;
      img.src = fallbackUrl;
    } else {
      // 如果所有代理都失败，隐藏图片并显示占位符
      img.style.display = "none";
      const parent = img.parentElement;
      if (parent) {
        parent.innerHTML =
          '<div class="w-full h-full bg-gray-200 flex items-center justify-center"><span class="text-gray-500 text-sm">图片加载失败</span></div>';
      }
    }
  };

  return (
    <img
      src={proxyUrl}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={() => {}}
      style={{ display: "block" }}
    />
  );
};
