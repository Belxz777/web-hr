import Link from "next/link";
import { convertDataToNormalTime } from "../utils/convertDataToNormalTime";

export const EmployeeStats = (departmentData: any) => {
  if (!departmentData || !departmentData.data) return null;

  return (
    <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border  shadow-lg m-2">
      <h2 className="text-xl font-bold mb-4">Статистика сотрудников</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b ">
              <th className="text-left py-2">Cотрудник</th>
              <th className="text-left py-2">Всего времени</th>
              <th className="text-left py-2">Проработано над функциями</th>
              <th className="text-left py-2">
                Проработано над дополнительными обязанностями
              </th>
            </tr>
          </thead>
          <tbody>
            {departmentData.data.map((employee: any,index:number) => {
              const timeOnFuncs = convertDataToNormalTime(
                employee.function_hours
              );
              const timeOnDuty = convertDataToNormalTime(employee.deputy_hours);

              return (
                <tr
                  key={index}
                  className="border-b border-gray-700"
                >
                  <td className="py-2">
                    {" "}
                    {employee.first_name} {employee.last_name}
                  </td>
                  <td className="py-2">
                    {Math.floor(employee.total_hours)} ч{" "}
                    {Math.round((employee.total_hours % 1) * 60)} мин
                  </td>
                  <td className="py-2">{timeOnFuncs}</td>
                  <td className="py-2">{timeOnDuty}</td>
                  <td className="py-2">
                    <Link
                      href={`/dashboard/employees/${employee.employee_id}`}
                    >
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
