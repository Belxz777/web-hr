import { StatCardProps } from "@/types";

export function StatCard({
    title,
    value,
    unit,
    percent,
    color,
    icon,
    trend,
    trendValue,
  }: StatCardProps) {
    return (
      <div className="bg-gray-700 rounded-2xl p-4 shadow">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-400 mb-1">{title}</div>
            <div className="flex items-end">
              <div className="text-xl font-bold">{value}</div>
              {unit && <div className="ml-1">{unit}</div>}
            </div>
            {percent && (
              <div className="mt-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    color || "bg-blue-500"
                  }`}
                >
                  {percent}%
                </span>
              </div>
            )}
          </div>
          {icon && <div className="text-gray-400">{icon}</div>}
        </div>
        {trend && (
          <div className="mt-2 flex items-center">
            <div
              className={`mr-1 ${
                trend === "up"
                  ? "text-green-500"
                  : trend === "down"
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
            </div>
            <div className="text-xs">{trendValue}</div>
          </div>
        )}
      </div>
    );
  }