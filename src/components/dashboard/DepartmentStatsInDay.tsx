import { DepartmentStatsProps } from "@/types";
import { StatCard } from "./StatCard";
import { convertDataToNormalTime } from "../utils/convertDataToNormalTime";

export const DepartmentStatsInDay = ({ data, title }: DepartmentStatsProps) => {  
   if (!data) return null;

     const totalHours = convertDataToNormalTime(data.total_hours);
     const fsHours = convertDataToNormalTime(data.function_hours);
     const deputyHours = convertDataToNormalTime(data.deputy_hours);
    
  
    return (
      <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border  shadow-lg m-3">
         <h1 className="text-3xl font-extrabold text-primary bg-card/80 backdrop-blur-sm rounded-xl pb-6 shadow-sm  border-primary select-none">
          {title}
        </h1>
        <div className="flex justify-between items-center mb-4 mt-4">
          <h2 className="text-xl font-bold">Статистика отдела</h2>
        </div>
  
        <div className="grid grid-cols-2 gap-4 ">
          <StatCard
            title="Общее отработанное время"
            value={totalHours}
            color="bg-blue-500"
          />
          <StatCard
            title="Кол-во сотрудников, работающих в этот день"
            value={data.employee_count}
            color="bg-purple-500"
          />
          <StatCard
            title="Функциональные обязанности"
            value={fsHours}
            color="bg-green-500"
          />
          <StatCard
            title="Дополнительные"
            value={deputyHours}
            color="bg-yellow-500"
          />
        </div>
      </div>
    );
  };