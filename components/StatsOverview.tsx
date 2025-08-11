import { formatDuration } from "@/lib/services/dataService";
import type { RadioProgramStats } from "@/types/RadioProgram";
import { Heart, MessageCircle, Bookmark, Radio, Clock } from "lucide-react";

interface StatsOverviewProps {
  stats: RadioProgramStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const statItems = [
    {
      label: "节目总数",
      value: stats.totalPrograms.toLocaleString(),
      icon: Radio,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "总点赞数",
      value: stats.totalLikes.toLocaleString(),
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: "总评论数",
      value: stats.totalComments.toLocaleString(),
      icon: MessageCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "总收藏数",
      value: stats.totalBookmarks.toLocaleString(),
      icon: Bookmark,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: "平均时长",
      value: formatDuration(stats.averageDuration),
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200"
        >
          <div className="flex items-center">
            <div className={`${item.bgColor} ${item.color} p-3 rounded-lg`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {item.label}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {item.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
