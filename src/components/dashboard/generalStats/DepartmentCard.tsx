import { DepartmentForStats } from "@/types";
import { CircularDiagramForDeps } from "../CircularDiagramForDeps";
import { convertDataToNormalTime } from "../../utils/convertDataToNormalTime";

export const DepartmentCard = ({ department }: { department: DepartmentForStats }) => {
  const { department_name, department_stats, employee_stats } = department;
  const {
    total_hours: total,
    function_hours: functionHours,
    deputy_hours: deputyHours,
    employee_count,
  } = department_stats;

  const convertedTotalHours = convertDataToNormalTime(total);

  return (
    <div className="bg-gray-700 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105">
      <div className="bg-red-600 p-3">
        <h3 className="text-lg font-bold text-white">{department_name}</h3>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="text-gray-300">
              <span className="text-gray-400">Всего часов:</span>{" "}
              {convertedTotalHours}
            </div>
            <div className="text-gray-300">
              <span className="text-gray-400">Сотрудников:</span>{" "}
              {employee_count}
            </div>
            {employee_stats.length > 0 && (
              <div className="text-gray-300 text-xs">
                <span className="text-gray-400">Активных сотрудников:</span>{" "}
                {employee_stats.length}
              </div>
            )}
            <div className="flex items-center mt-2 space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
              <span className="text-xs text-gray-300">
                Функции: {convertDataToNormalTime(functionHours)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-300 rounded-sm"></div>
              <span className="text-xs text-gray-300">
                Дополнительные обязанности: {convertDataToNormalTime(deputyHours)}
              </span>
            </div>
          </div>
          <CircularDiagramForDeps
            functionHours={functionHours}
            deputyHours={deputyHours}
          />
        </div>
      </div>
    </div>
  );
};
