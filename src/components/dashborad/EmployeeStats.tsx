export const EmployeeStats = (departmentData: any) => {
    if (!departmentData) return null;
  
    return (
      <div className="bg-gray-800 rounded-2xl p-4 m-2">
        <h2 className="text-xl font-bold mb-4">Статистика сотрудников</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2">ID сотрудника</th>
                <th className="text-left py-2">Всего часов</th>
                <th className="text-left py-2">Функциональные обязанности</th>
                <th className="text-left py-2">Дополнительные</th>
              </tr>
            </thead>
            <tbody>
              {departmentData.data.map((employee: any) => (
                <tr
                  key={employee.employee_id}
                  className="border-b border-gray-700"
                >
                  <td className="py-2">{employee.employee_id}</td>
                  <td className="py-2">{employee.total_hours.toFixed(2)} ч</td>
                  <td className="py-2">{employee.function_hours.toFixed(2)} ч</td>
                  <td className="py-2">{employee.deputy_hours.toFixed(2)} ч</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };