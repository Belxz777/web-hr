import Link from "next/link";

export const EmployeeStats = (departmentData: any) => {
  if (!departmentData) return null;

  return (
    <div className="bg-gray-800 rounded-2xl p-4 m-2">
      <h2 className="text-xl font-bold mb-4">Статистика сотрудников</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-2">Cотрудник</th>
              <th className="text-left py-2">Всего времени</th>
              <th className="text-left py-2">Проработано над функциями</th>
              <th className="text-left py-2">Проработано над дополнительными обязанностями</th>
            </tr>
          </thead>
          <tbody>
            {departmentData.data.map((employee: any) => (
              <>
                <tr
                  key={employee.employee_id}
                  className="border-b border-gray-700"
                >
                  <td className="py-2">  {employee.first_name} {employee.last_name}</td>
                  <td className="py-2">{Math.floor(employee.total_hours)} ч  {Math.round((employee.total_hours % 1) * 60)} мин</td>
                  <td className="py-2">
                
                    {Math.floor(employee.function_hours)} ч {Math.round((employee.function_hours % 1) * 60)} мин
                  </td>
                  <td className="py-2"> 
                  {Math.floor(employee.deputy_hours)} ч {Math.round((employee.deputy_hours % 1) * 60)} мин

                  </td>
                  <td className="py-2">
                    <Link href={`/dashboard/employees/${employee.employee_id}/perDay`}>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-3xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/50"
                      >
                        Подробнее
                      </button>
                    </Link>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
