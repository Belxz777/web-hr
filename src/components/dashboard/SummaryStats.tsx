"use client"
import { DepartmentsData } from "@/types";
import { useMemo } from "react";
import { convertDataToNormalTime } from "@/components/utils/convertDataToNormalTime";
import { CircularDiagramForDeps } from "./CircularDiagramForDeps";

export const SummaryStats = ({ data }: { data: DepartmentsData }) => {
  const totalStats = useMemo(
    () =>
      data.departments.reduce(
        (acc, dept) => {
          acc.total_hours += dept.department_stats.total_hours;
          acc.function_hours += dept.department_stats.function_hours;
          acc.deputy_hours += dept.department_stats.deputy_hours;
          acc.employee_count += dept.department_stats.employee_count;
          return acc;
        },
        {
          total_hours: 0,
          function_hours: 0,
          deputy_hours: 0,
          employee_count: 0,
        }
      ),
    [data]
  );

  const convertedTotalHours = convertDataToNormalTime(totalStats.total_hours);
  const convertedFunctionHours = convertDataToNormalTime(
    totalStats.function_hours
  );
  const convertedDeputyHours = convertDataToNormalTime(
    totalStats.deputy_hours
  );

  return (
    <div className="bg-gray-800 rounded-2xl p-4 mb-6">
      <h3 className="text-xl font-bold text-gray-200 mb-4">Общая статистика</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 rounded-xl p-4 text-center">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">
            Всего часов
          </h4>
          <div className="text-2xl font-bold text-red-400">
            {convertedTotalHours}
          </div>
        </div>
        <div className="bg-gray-700 rounded-xl p-4 text-center">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">
            Часы на функции
          </h4>
          <div className="text-2xl font-bold text-red-400">
            {convertedFunctionHours}
          </div>
        </div>
        <div className="bg-gray-700 rounded-xl p-4 text-center">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">
            Часы на поручения
          </h4>
          <div className="text-2xl font-bold text-red-400">
            {convertedDeputyHours}
          </div>
        </div>
        <div className="bg-gray-700 rounded-xl p-4 text-center">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">
            Сотрудников
          </h4>
          <div className="text-2xl font-bold text-red-400">
            {totalStats.employee_count}
          </div>
        </div>
      </div>
      {totalStats.total_hours > 0 && (
        <div className="mt-6 flex justify-center">
          <div className="bg-gray-700 rounded-xl p-4 max-w-md w-full">
            <h4 className="text-lg font-semibold text-gray-300 mb-4 text-center">
              Распределение часов по типу
            </h4>
            <div className="flex items-center justify-center space-x-8">
              <CircularDiagramForDeps
                functionHours={totalStats.function_hours}
                deputyHours={totalStats.deputy_hours}
              />
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                  <span className="text-gray-300">
                    Функции: {convertedFunctionHours} (
                    {totalStats.total_hours > 0
                      ? (
                          (totalStats.function_hours / totalStats.total_hours) *
                          100
                        ).toFixed(0)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-300 rounded-sm"></div>
                  <span className="text-gray-300">
                    Поручения: {convertedDeputyHours} (
                    {totalStats.total_hours > 0
                      ? (
                          (totalStats.deputy_hours / totalStats.total_hours) *
                          100
                        ).toFixed(0)
                      : 0}
                    %)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

