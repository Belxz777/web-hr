import { DepartmentStatsProps } from "@/types";
import { StatCard } from "./StatCard";

export const DepartmentStatsInDay = ({ data }: DepartmentStatsProps) => {
    if (!data) return null;
  
    return (
      <div className="bg-gray-800 rounded-2xl p-5 shadow-lg m-3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Статистика отдела</h2>
        </div>
  
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Всего часов"
            value={data.total_hours.toFixed(2)}
            unit="ч"
            color="bg-blue-500"
          />
          <StatCard
            title="Кол-во сотрудников, работающих в этот день"
            value={data.employee_count}
            color="bg-purple-500"
          />
          <StatCard
            title="Функциональные обязанности"
            value={data.function_hours.toFixed(2)}
            unit="ч"
            color="bg-green-500"
          />
          <StatCard
            title="Дополнительные"
            value={data.deputy_hours.toFixed(2)}
            unit="ч"
            color="bg-yellow-500"
          />
        </div>
      </div>
    );
  };