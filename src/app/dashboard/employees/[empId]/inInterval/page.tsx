"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import UniversalFooter from "@/components/buildIn/UniversalFooter";
import { useParams } from "next/navigation";
import { EmployeeDistribution, EmployeeSummary } from "@/types";
import { CircularDiagram } from "@/components/dashborad/CircularDiagram";
import analyticsEmployeeInInterval from "@/components/server/analyticsEmployeeInInterval";
import analyticsEmployeeInIntervalPercentager from "@/components/server/analyticsEmployeeInIntervalPercentager";
import Link from "next/link";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export default function EmployeeDailyStatsInInterval() {
  const [employeeSummary, setEmployeeSummary] = useState<EmployeeSummary>();
  const [employeeDistribution, setEmployeeDistribution] =
    useState<EmployeeDistribution>();
  const { empId } = useParams();
  const [selectedStartDate, setSelectedStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedEndDate, setSelectedEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const fetchEmployeeSummaryInfo = async () => {
      try {
        const empInfo = await analyticsEmployeeInInterval(
          Number(empId),
          selectedStartDate,
          selectedEndDate
        );
        setEmployeeSummary(empInfo);
      } catch (error) {
        console.error("Failed to fetch employee summary info:", error);
      }
    };
    fetchEmployeeSummaryInfo();
  }, [empId, selectedStartDate, selectedEndDate]);

  useEffect(() => {
    const fetchEmployeeDistributionInfo = async () => {
      try {
        const empInfoPer = await analyticsEmployeeInIntervalPercentager(
          Number(empId),
          selectedStartDate,
          selectedEndDate
        );
        setEmployeeDistribution(empInfoPer);
      } catch (error) {
        console.error("Failed to fetch employee distribution info:", error);
      }
    };
    fetchEmployeeDistributionInfo();
  }, [empId, selectedStartDate, selectedEndDate]);

  if (!employeeSummary || !employeeDistribution) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
        <div className="w-16 h-16 border-b-2 border-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const typicalHours =
    employeeDistribution.distribution.by_functions.typical.reduce(
      (sum, func) => sum + func.hours,
      0
    ) || 0;
  const nonTypicalHours =
    employeeDistribution.distribution.by_functions.non_typical.reduce(
      (sum, func) => sum + func.hours,
      0
    ) || 0;
  const deputyHours =
    employeeDistribution.distribution.extra.reduce(
      (sum, entry) => sum + entry.hours,
      0
    ) || 0;

  const hourDistributionData = [
    { label: "Функции", value: typicalHours, color: "#3B82F6" },
    { label: "Нетипичные", value: nonTypicalHours, color: "#10B981" },
    {
      label: "Функциональные обязанности",
      value: deputyHours,
      color: "#F59E0B",
    },
    {
      label: "Дополнительные",
      value: employeeSummary.summary.non_compulsory_hours || 0,
      color: "#8B5CF6",
    },
  ];

  const avgHoursPerDay = employeeSummary.summary.total_hours || 0;
  const avgHoursPerReport =
    employeeSummary.reports_count > 0
      ? employeeSummary.summary.total_hours / employeeSummary.reports_count
      : 0;

  return (
    <div className="mainProfileDiv bg-gray-900">
      <Header title="Статистика сотрудника" showPanel={false} />
      <main className="container mx-auto p-4 flex-grow">
        <div className="bg-gray-800 rounded-2xl p-4 m-2 flex justify-around items-center shadow-lg">
          <Link href={`/dashboard/employees/${empId}/perDay`}>
            <div className="bg-gray-900 rounded-2xl cursor-pointer hover:bg-gray-800 transition-colors p-2">
              <h2 className="text-xl font-bold m-3">
                Статистика сотрудника за день
              </h2>
            </div>
          </Link>
          <Link href={`/dashboard/employees/${empId}/inInterval`}>
            <div className="bg-gray-700 rounded-2xl cursor-pointer hover:bg-gray-600 transition-colors p-2">
              <h2 className="text-xl font-bold m-3">
                Статистика сотрудника за промежуток времени
              </h2>
            </div>
          </Link>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 mb-6">
            <div className="bg-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {employeeSummary.employee.employee_surname}{" "}
                    {employeeSummary.employee.employee_name}{" "}
                    {employeeSummary.employee.employee_patronymic}
                  </h1>
                  <p className="text-red-100">
                    ID: {employeeSummary.employee.employee_id}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-200">
                  Статистика за день
                </h2>
                <div className="flex items-center">
                  <label htmlFor="date-select" className="mr-2 text-gray-300">
                    Начальная дата:
                  </label>
                  <input
                    id="date-select"
                    type="date"
                    value={selectedStartDate}
                    onChange={(e) => setSelectedStartDate(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="flex items-center">
                  <label htmlFor="date-select" className="mr-2 text-gray-300">
                    Конечная дата:
                  </label>
                  <input
                    id="date-select"
                    type="date"
                    value={selectedEndDate}
                    onChange={(e) => setSelectedEndDate(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 rounded-xl p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    Общее количество часов
                  </h3>
                  <div className="text-3xl font-bold text-red-400">
                    {employeeSummary.summary.total_hours.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Отчетов: {employeeSummary.reports_count}
                  </div>
                </div>
                <div className="bg-gray-700 rounded-xl p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    Средние показатели
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-xl font-bold text-red-400">
                        {avgHoursPerDay.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-400">часов в день</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-red-400">
                        {avgHoursPerReport.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-400">
                        часов на отчет
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-xl p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    Период
                  </h3>
                  <div className="text-xl font-bold text-red-400">
                    с{" "}
                    {formatDate(
                      employeeDistribution.time_period.start_date || ""
                    )}{" "}
                    до{" "}
                    {formatDate(
                      employeeDistribution.time_period.end_date || ""
                    )}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {employeeDistribution.time_period.type === "single_day"
                      ? "Один день"
                      : "Период"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 mb-6">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-xl font-bold text-gray-200">
                Распределение часов
              </h3>
            </div>
            <div className="p-6 flex justify-center">
              <CircularDiagram data={hourDistributionData} title="" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 mb-6">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-xl font-bold text-gray-200">
                Детализация по функциям
              </h3>
            </div>
            <div
              className="p-4"
              style={{ maxHeight: "calc(100vh - 400px)", overflowY: "scroll" }}
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Функция
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Часы
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Процент
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Записи
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {employeeDistribution.distribution.by_functions.typical
                      .length === 0 &&
                    employeeDistribution.distribution.by_functions.non_typical
                      .length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-4 text-center text-gray-500"
                        >
                          Нет данных по функциям
                        </td>
                      </tr>
                    ) : (
                      <>
                        {employeeDistribution.distribution.by_functions.typical.map(
                          (func) => (
                            <tr key={`typical-${func.function_id}`}>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                                  <span className="text-gray-300">
                                    {func.function_name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                                {func.hours.toFixed(1)}ч
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                                {func.percent.toFixed(1)}%
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                                {func.entries_count}
                              </td>
                            </tr>
                          )
                        )}
                        {employeeDistribution.distribution.by_functions.non_typical.map(
                          (func) => (
                            <tr key={`non-typical-${func.function_id}`}>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-2 h-2 bg-red-300 rounded-full mr-2"></div>
                                  <span className="text-gray-300">
                                    {func.function_name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                                {func.hours.toFixed(1)}ч
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                                {func.percent.toFixed(1)}%
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                                {func.entries_count}
                              </td>
                            </tr>
                          )
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div
            className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 mb-6"
            style={{ maxHeight: "calc(100vh - 400px)", overflowY: "scroll" }}
          >
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-xl font-bold text-gray-200">Отчеты</h3>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Функция
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Часы
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Обязательная
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Комментарий
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Дата
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {(employeeSummary as EmployeeSummary).reports.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-4 text-center text-gray-500"
                        >
                          Нет отчетов за выбранный период
                        </td>
                      </tr>
                    ) : (
                      (employeeSummary as EmployeeSummary).reports.map(
                        (report: any) => (
                          <tr key={report.laborCostId}>
                            <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                              {report.laborCostId}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                              {report.function || report.deputy || "N/A"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                              {report.worked_hours.toFixed(1)}ч
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {report.compulsory ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-200">
                                  Да
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                                  Нет
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                              {report.comment}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                              {new Date(report.date).toLocaleString("ru-RU")}
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mb-6">
            <button
              className="px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-xl hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => window.print()}
            >
              Печать
            </button>
          </div>
        </div>
      </main>
      <UniversalFooter />
    </div>
  );
}
