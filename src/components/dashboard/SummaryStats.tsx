"use client"

import type { DepartmentsData } from "@/types"
import { useMemo } from "react"
import { convertDataToNormalTime } from "@/components/utils/convertDataToNormalTime"
import { CircularDiagramForDeps } from "./CircularDiagramForDeps"
import { basicColors } from "@/store/sets"

export const SummaryStats = ({ data }: { data: DepartmentsData }) => {
  const totalStats = useMemo(
    () =>
      data.departments.reduce(
        (acc, dept) => {
          acc.total_hours += dept.department_stats.total_hours
          acc.function_hours += dept.department_stats.function_hours
          acc.deputy_hours += dept.department_stats.deputy_hours
          acc.employee_count += dept.department_stats.employee_count
          return acc
        },
        {
          total_hours: 0,
          function_hours: 0,
          deputy_hours: 0,
          employee_count: 0,
        },
      ),
    [data],
  )

  const convertedTotalHours = convertDataToNormalTime(totalStats.total_hours)
  const convertedFunctionHours = convertDataToNormalTime(totalStats.function_hours)
  const convertedDeputyHours = convertDataToNormalTime(totalStats.deputy_hours)

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-[#000000]">Общая статистика</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-[#249BA2] to-[#1e8a90] rounded-xl p-4 text-center text-white">
            <div className="flex items-center justify-center mb-2">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h4 className="text-sm font-semibold">Всего часов</h4>
            </div>
            <div className="text-2xl font-bold">{convertedTotalHours}</div>
          </div>

          <div className={` ${basicColors.main.typical}  rounded-xl p-4 text-center text-white`}>
            <div className="flex items-center justify-center mb-2">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h4 className="text-sm font-semibold">Часы на функции</h4>
            </div>
            <div className="text-2xl font-bold">{convertedFunctionHours}</div>
          </div>

          <div className="bg-gradient-to-br from-[#249BA2] to-[#1e8a90] rounded-xl p-4 text-center text-white">
            <div className="flex items-center justify-center mb-2">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h4 className="text-sm font-semibold">Дополнительные обязанности</h4>
            </div>
            <div className="text-2xl font-bold">{convertedDeputyHours}</div>
          </div>

          <div className="bg-gradient-to-br from-[#249BA2] to-[#1e8a90] rounded-xl p-4 text-center text-white">
            <div className="flex items-center justify-center mb-2">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <h4 className="text-sm font-semibold">Сотрудников работало</h4>
            </div>
            <div className="text-2xl font-bold">{totalStats.employee_count}</div>
          </div>
        </div>
      </div>

      {totalStats.total_hours > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[#000000] mb-4 text-center">Распределение часов по типу</h3>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex-shrink-0">
              <CircularDiagramForDeps functionHours={totalStats.function_hours} deputyHours={totalStats.deputy_hours} />
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 ${basicColors.main.typical} rounded-sm`}></div>
                <span className="text-[#000000]">
                  Функции: <span className="font-semibold">{convertedFunctionHours}</span> (
                  {totalStats.total_hours > 0
                    ? ((totalStats.function_hours / totalStats.total_hours) * 100).toFixed(0)
                    : 0}
                  %)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 ${basicColors.extra} rounded-sm`}></div>
                <span className="text-[#000000]">
                  Дополнительные: <span className="font-semibold">{convertedDeputyHours}</span> (
                  {totalStats.total_hours > 0
                    ? ((totalStats.deputy_hours / totalStats.total_hours) * 100).toFixed(0)
                    : 0}
                  %)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
