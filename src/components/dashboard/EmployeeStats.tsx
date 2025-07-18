"use client";
import Link from "next/link";
import { convertDataToNormalTime } from "../utils/convertDataToNormalTime";

interface TimePeriod {
  date?: string;
  end_date?: string;
  start_date?: string;
  type: string;
}

interface EmployeeStatsProps {

  employeeStats: Array<{
    first_name: string;
      last_name: string;
      patronymic: string;
      deputy_hours: number;
      employee_id: number;
      function_hours: number;
      total_hours: number;
    }>;
  time_period: TimePeriod;
}

export const EmployeeStats: React.FC<EmployeeStatsProps> = ({ employeeStats, time_period }) => {
  if (!employeeStats || !employeeStats) return null;

  // Функция для формирования URL с параметрами даты
  const getEmployeeLink = (employeeId: number) => {
    const baseUrl = `/analytics/mydepartment/employees/${employeeId}`;
    
    if (time_period.type === "single_day" && time_period.date) {
      return `${baseUrl}?date=${time_period.date}`;
    }
    
    if (time_period.type === "period" && time_period.start_date && time_period.end_date) {
      return `${baseUrl}?start_date=${time_period.start_date}&end_date=${time_period.end_date}`;
    }
    
    return baseUrl;
  };

  return (
    <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border shadow-lg m-2">
      <h2 className="text-xl font-bold mb-4">Статистика сотрудников</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Cотрудник</th>
              <th className="text-left py-2">Всего времени</th>
              <th className="text-left py-2">Проработано над функциями</th>
              <th className="text-left py-2">
                Проработано над дополнительными обязанностями
              </th>
              <th className="text-left py-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {employeeStats.map((employee, index) => {
              const timeOnFuncs = convertDataToNormalTime(employee.function_hours);
              const timeOnDuty = convertDataToNormalTime(employee.deputy_hours);

              return (
                <tr key={index} className="border-b border-gray-700">
                  <td className="py-2">
                    {employee.first_name} {employee.last_name}
                  </td>
                  <td className="py-2">
                    {Math.floor(employee.total_hours)} ч{" "}
                    {Math.round((employee.total_hours % 1) * 60)} мин
                  </td>
                  <td className="py-2">{timeOnFuncs}</td>
                  <td className="py-2">{timeOnDuty}</td>
                  <td className="py-2">
                    <Link href={getEmployeeLink(employee.employee_id)}>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-3xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/50"
                      >
                        Подробнее
                      </button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};