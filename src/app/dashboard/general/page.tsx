"use client";

import { analyticsDepartments } from "@/components/server/analysis/departmentanalysis";
import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import UniversalFooter from "@/components/buildIn/UniversalFooter";
import { CircularDiagramForDeps } from "@/components/dashboard/CircularDiagramForDeps";
import { SummaryStats } from "@/components/dashboard/SummaryStats";
import { DepartmentCard } from "@/components/dashboard/generalStats/DepartmentCard";
import { EmptyState } from "@/components/dashboard/generalStats/EmptyState";

type TimePeriod = {
  type: string;
  date: string;
  start_date: string | null;
  end_date: string | null;
};

type DepartmentStats = {
  total_hours: number;
  function_hours: number;
  deputy_hours: number;
  employee_count: number;
};

type EmployeeStats = Array<any>;

type Department = {
  department_id: number;
  department_name: string;
  time_period: TimePeriod;
  department_stats: DepartmentStats;
  employee_stats: EmployeeStats;
};

type DepartmentsData = {
  departments: Department[];
  total_departments: number;
};

const formatDisplayDate = (dateString: string) => {
  const [year, month, day] = dateString.split("-");
  return `${day}.${month}.${year}`;
};

export default function GeneralDashboard() {
  const [depsGeneraData, setDepsGeneraData] = useState<DepartmentsData>({ departments: [], total_departments: 0 });
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("2025-05-06");
  const [error, setError] = useState<string | null>(null);

  const fetchDepsGeneral = async (date: string) => {
    if (!date) {
      setError("Пожалуйста, выберите дату");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsDepartments({ date });
      setDepsGeneraData(data);
    } catch (error: any) {
      console.error("Failed to fetch department data", error);
      setError(error.message || "Ошибка при загрузке данных");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepsGeneral(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (newDate) {
      setSelectedDate(newDate);
    }
  };

  const hasData = depsGeneraData.departments.some(
    (dept) => dept.department_stats.total_hours > 0 || dept.department_stats.employee_count > 0,
  );

  const date = depsGeneraData.departments[0]?.time_period.date || selectedDate;

  return (
    <div className="mainProfileDiv bg-gray-900">
      <Header title="Общая статистика отделов" showPanel={false} />
      <main className="container mx-auto p-4 flex-grow">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800 rounded-2xl p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-bold text-gray-200 mb-4 md:mb-0">
                Статистика по отделам за {formatDisplayDate(date)}
              </h2>
              <div className="flex items-center space-x-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  max={new Date().toISOString().split("T")[0]}
                  className="bg-gray-700 text-gray-200 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
            {error && (
              <div className="mt-4 text-red-400 text-sm">{error}</div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-200">Загрузка...</p>
            </div>
          ) : (
            <>
              <SummaryStats data={depsGeneraData} />

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-4">
                  Отделы ({depsGeneraData.total_departments})
                </h3>
                {hasData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {depsGeneraData.departments.map((department) => (
                      <DepartmentCard key={department.department_id} department={department} />
                    ))}
                  </div>
                ) : (
                  <EmptyState date={date} />
                )}
              </div>

              <div className="bg-gray-800 rounded-2xl p-4 mb-6 overflow-hidden">
                <h3 className="text-xl font-bold text-gray-200 mb-4">Таблица отделов</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                          ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                          Название
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                          Всего часов
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                          Функции
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                          Поручения
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                          Сотрудников
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {depsGeneraData.departments.map((department) => (
                        <tr key={department.department_id} className="hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {department.department_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                            {department.department_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {department.department_stats.total_hours.toFixed(1)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {department.department_stats.function_hours.toFixed(1)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {department.department_stats.deputy_hours.toFixed(1)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {department.department_stats.employee_count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <UniversalFooter />
    </div>
  );
}