"use client"

interface Report {

    laborCostId: number;
    departmentId: number;
    function__funcName: string | null;
    deputy__deputyName: string | null;
    compulsory: boolean;
    worked_hours: number;
    comment: string;
    date: string;

}

interface ReportsTableProps {
  reports: Report[]
  convertDataToNormalTime: (hours: number) => string
}

export const ReportsTable = ({ reports, convertDataToNormalTime }: ReportsTableProps) => {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
      style={{ maxHeight: "calc(100vh - 400px)", overflowY: "scroll" }}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-t-xl">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Отчеты</h3>
      </div>

      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Название
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Время
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Обязательная?
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Комментарий
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Дата
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                    Нет отчетов за выбранный период
                  </td>
                </tr>
              ) : (
                reports.map((report, index) => {
                  const workedHours = convertDataToNormalTime(report.worked_hours || 0)
                  return (
                    <tr
                      key={report.laborCostId || index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-gray-100">
                        {report.function__funcName || report.deputy__deputyName || "N/A"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-gray-100">{workedHours}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {report.compulsory ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800">
                            Да
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                            Нет
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-gray-100">
                        {report.comment || "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-gray-100">
                        {report.date ? new Date(report.date).toLocaleString("ru-RU") : "N/A"}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
