import type { StatCardProps } from "@/types"

export function StatCard({
  title,
  subtitle,
  value,
  unit,
  percent,
  color,
  icon,
  trend,
  trendValue,
}: StatCardProps & { subtitle?: string }) {
  return (
    <div className="group bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Header with icon */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-600 mb-1 leading-tight">{title}</div>
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        </div>
        {icon && <div className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity">{icon}</div>}
      </div>

      {/* Main value */}
      <div className="mb-3">
        <div className="flex items-baseline">
          <div className="text-3xl font-bold text-gray-900 leading-none">{value}</div>
          {unit && <div className="ml-2 text-lg font-medium text-gray-600">{unit}</div>}
        </div>
      </div>

      {/* Percentage badge */}
      {percent && (
        <div className="mb-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${color || "from-blue-500 to-blue-600"} shadow-sm`}
          >
            {percent}%
          </span>
        </div>
      )}

      {/* Trend indicator */}
      {trend && (
        <div className="flex items-center pt-2 border-t border-gray-100">
          <div
            className={`flex items-center text-sm font-medium ${
              trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"
            }`}
          >
            <span className="mr-1 text-base">{trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}</span>
            {trendValue}
          </div>
        </div>
      )}

      {/* Gradient accent line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1  ${color || "from-blue-500 to-blue-600"} rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      ></div>
    </div>
  )
}
