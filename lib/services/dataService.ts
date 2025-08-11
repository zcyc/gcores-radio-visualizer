import type { RadioProgram, RadioProgramStats } from "@/types/RadioProgram";

const CSV_URL =
  "https://raw.githubusercontent.com/jerryshell/gcores-best-radio/refs/heads/master/data.csv";

// Advanced CSV parser function that handles quoted fields properly
function parseCSV(csvText: string): any[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  // Parse CSV line considering quoted fields
  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Handle escaped quotes ("" becomes ")
          current += '"';
          i += 2;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === "," && !inQuotes) {
        // Field separator outside quotes
        result.push(current.trim());
        current = "";
        i++;
      } else {
        current += char;
        i++;
      }
    }

    // Add the last field
    result.push(current.trim());

    return result;
  };

  const headers = parseCsvLine(lines[0]);
  const data: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const values = parseCsvLine(line);
    const obj: any = {};

    headers.forEach((header, index) => {
      let value = values[index] || "";

      // Clean up any remaining quotes at the beginning and end
      value = value.replace(/^["\']+|["\']+$/g, "");

      // Convert numeric fields
      if (
        header === "comments-count" ||
        header === "likes-count" ||
        header === "bookmarks-count" ||
        header === "duration"
      ) {
        const numValue = parseInt(value, 10);
        obj[header] = isNaN(numValue) ? 0 : numValue;
      } else {
        obj[header] = value;
      }
    });

    data.push(obj);
  }

  return data;
}

export const fetchRadioPrograms = async (): Promise<RadioProgram[]> => {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();
    const data = parseCSV(csvText) as RadioProgram[];

    return data;
  } catch (error) {
    console.error("Error fetching radio programs:", error);
    throw error;
  }
};

export const calculateStats = (programs: RadioProgram[]): RadioProgramStats => {
  const totalPrograms = programs.length;
  const totalLikes = programs.reduce(
    (sum, program) => sum + program["likes-count"],
    0,
  );
  const totalComments = programs.reduce(
    (sum, program) => sum + program["comments-count"],
    0,
  );
  const totalBookmarks = programs.reduce(
    (sum, program) => sum + program["bookmarks-count"],
    0,
  );
  const totalDuration = programs.reduce(
    (sum, program) => sum + program.duration,
    0,
  );
  const averageDuration =
    totalPrograms > 0 ? Math.round(totalDuration / totalPrograms) : 0;

  return {
    totalPrograms,
    totalLikes,
    totalComments,
    totalBookmarks,
    averageDuration,
  };
};

export const formatDuration = (totalSeconds: number): string => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  if (mins > 0) {
    return `${mins}分${secs}秒`;
  }

  return `${secs}秒`;
};

export const formatDate = (dateString: string): string => {
  try {
    // 清理日期字符串
    const cleanDate = dateString?.trim().replace(/^"+|"+$/g, "") || "";

    if (!cleanDate) {
      return "未知日期";
    }

    const date = new Date(cleanDate);

    // 检查是否为有效日期
    if (isNaN(date.getTime())) {
      return "无效日期";
    }

    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return "日期错误";
  }
};

export const formatImageUrl = (filename: string | null | undefined): string => {
  if (!filename || filename === "null" || filename.trim() === "") {
    return "";
  }

  // 如果已经是完整URL，直接返回
  if (filename.startsWith("http")) {
    return filename;
  }

  const cleanFilename = filename.trim();

  if (!cleanFilename || cleanFilename === "null") {
    return "";
  }

  return `https://image.gcores.com/${cleanFilename}`;
};

export const formatImageUrlWithFallback = (
  filename: string | null | undefined,
): string => {
  if (!filename || filename === "null" || filename.trim() === "") {
    return "https://via.placeholder.com/300x200/6B7280/FFFFFF?text=封面未找到";
  }

  const cleanFilename = filename.trim();
  if (!cleanFilename || cleanFilename === "null") {
    return "https://via.placeholder.com/300x200/6B7280/FFFFFF?text=封面未找到";
  }

  return `https://image.gcores.com/${cleanFilename}`;
};
