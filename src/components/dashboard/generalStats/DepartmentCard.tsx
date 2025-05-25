import type { DepartmentForStats } from "@/types"
import { CircularDiagramForDeps } from "../CircularDiagramForDeps"
import { convertDataToNormalTime } from "../../utils/convertDataToNormalTime"

export const DepartmentCard = ({ department }: { department: DepartmentForStats }) => {
  const { department_name, department_stats, employee_stats } = department
  const {
    total_hours: total,
    function_hours: functionHours,
    deputy_hours: deputyHours,
    employee_count,
  } = department_stats

  const convertedTotalHours = convertDataToNormalTime(total)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#249BA2]">
      <div className="bg-gradient-to-r from-[#249BA2] to-[#1e8a90] p-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          {department_name}
        </h3>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[#6D6D6D] text-sm">Всего часов:</span>
              <span className="font-semibold text-[#000000]">{convertedTotalHours}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#6D6D6D] text-sm">Сотрудников:</span>
              <span className="font-semibold text-[#000000]">{employee_count}</span>
            </div>

            {employee_stats.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-[#6D6D6D] text-sm">Активных:</span>
                <span className="font-semibold text-[#249BA2]">{employee_stats.length}</span>
              </div>
            )}

            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#249BA2] rounded-sm mr-2"></div>
                  <span className="text-xs text-[#6D6D6D]">Функции:</span>
                </div>
                <span className="text-xs font-medium text-[#000000]">{convertDataToNormalTime(functionHours)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#FF0000] rounded-sm mr-2"></div>
                  <span className="text-xs text-[#6D6D6D]">Поручения:</span>
                </div>
                <span className="text-xs font-medium text-[#000000]">{convertDataToNormalTime(deputyHours)}</span>
              </div>
            </div>
          </div>

          <div className="ml-4 flex-shrink-0">
            <CircularDiagramForDeps functionHours={functionHours} deputyHours={deputyHours} />
          </div>
        </div>
      </div>
    </div>
  )
}
