import type { DepartmentStatsProps } from "@/types"
import { StatCard } from "./StatCard"
import { convertDataToNormalTime } from "../utils/convertDataToNormalTime"
import { basicColors } from "@/store/sets"

export const DepartmentStatsInDay = ({ data, title }: DepartmentStatsProps) => {
  if (!data) return null

  const totalHours = convertDataToNormalTime(data.total_hours)
  const fsHours = convertDataToNormalTime(data.function_hours)
  const deputyHours = convertDataToNormalTime(data.deputy_hours)

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-xl m-3">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
        <div className="h-1 w-20 bg-secondary rounded-full"></div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Общая статистика отдела</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Общее отработанное время" value={totalHours} color="bg-secondary" />
        <StatCard
          title="Сотрудников работало"
          value={data.employee_count}
          color="bg-secondary"
        />
        <StatCard title="Функциональные обязанности" value={fsHours} 
                color={basicColors.main.typical}  />
        <StatCard
          title="Дополнительные обязанности"
          value={deputyHours}
          color={basicColors.extra}
        />
      </div>
    </div>
  )
}
