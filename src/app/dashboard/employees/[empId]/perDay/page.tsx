"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import UniversalFooter from "@/components/buildIn/UniversalFooter";
import { useParams } from "next/navigation";
import analyticsEmployeeInDay from "@/components/server/analyticsEmployeeInDay";
import analyticsEmployeeInDayPercentager from "@/components/server/analyticsEmployeeInDayPercentager";
import { EmployeeDistribution, EmployeeSummary } from "@/types";
import { CircularDiagram } from "@/components/dashboard/CircularDiagram";
import Link from "next/link";
import { convertDataToNormalTime } from "@/components/utils/convertDataToNormalTime";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export default function EmployeeDailyStats() {
  const [employeeSummary, setEmployeeSummary] = useState<EmployeeSummary>();
  const [employeeDistribution, setEmployeeDistribution] =
    useState<EmployeeDistribution>();
  const { empId } = useParams();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const totalTime = convertDataToNormalTime(
    employeeSummary?.summary?.total_hours || 0
  );

  useEffect(() => {
    const fetchEmployeeSummaryInfo = async () => {
      try {
        const empInfo = await analyticsEmployeeInDay(
          Number(empId),
          selectedDate
        );
        setEmployeeSummary(empInfo);
      } catch (error) {
        console.error("Failed to fetch employee summary info:", error);
      }
    };
    fetchEmployeeSummaryInfo();
  }, [empId, selectedDate]);

  useEffect(() => {
    const fetchEmployeeDistributionInfo = async () => {
      try {
        const empInfoPer = await analyticsEmployeeInDayPercentager(
          Number(empId),
          selectedDate
        );
        setEmployeeDistribution(empInfoPer);
      } catch (error) {
        console.error("Failed to fetch employee distribution info:", error);
      }
    };
    fetchEmployeeDistributionInfo();
  }, [empId, selectedDate]);

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
    // { label: "Функции", value: typicalHours, color: "#3B82F6" },
    // { label: "Нетипичные", value: nonTypicalHours, color: "#10B981" },
    {
      label: "Основные",
      value: employeeSummary.summary.compulsory_hours || 0,
      color: "#32CD32",
    },
    {
      label: "Дополнительные",
      value: employeeSummary.summary.non_compulsory_hours || 0,
      color: "#FFD700",
    },
  ];
  const hourDistributionDataType = [
    // { label: "Функции", value: typicalHours, color: "#3B82F6" },
    // { label: "Нетипичные", value: nonTypicalHours, color: "#10B981" },
    {
      label: "Типичные для сотрудника",
      value: typicalHours || 0,
      color: "#008000",
    },
    {
      label: "Нетипичные для сотрудника",
      value: nonTypicalHours || 0,
      color: "#DC143C",
    },
    {
      label: "Дополнительные",
      value: deputyHours || 0,
      color: "#DAA520",
    },
  ];

  const avgHoursPerReport =
    employeeSummary.reports_count > 0
      ? employeeSummary.summary.total_hours / employeeSummary.reports_count
      : 0;

  const avgTime = convertDataToNormalTime(avgHoursPerReport || 0);

  return (
    <div className="mainProfileDiv bg-gray-900">
      <Header title="Статистика сотрудника" showPanel={false} />
      <main className="container mx-auto p-4 flex-grow">
        <div className="bg-gray-800 rounded-2xl p-4 m-2 flex justify-around items-center shadow-lg">
          <Link href={`/dashboard/employees/${empId}/perDay`}>
            <div className="bg-gray-700 rounded-2xl cursor-pointer hover:bg-gray-600 transition-colors p-2">
              <h2 className="text-xl font-bold m-3">
                Статистика сотрудника за день
              </h2>
            </div>
          </Link>
          <Link href={`/dashboard/employees/${empId}/inInterval`}>
            <div className="bg-gray-900 rounded-2xl cursor-pointer hover:bg-gray-800 transition-colors p-2">
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
                    Дата:
                  </label>
                  <input
                    id="date-select"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 rounded-xl p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    Общее отработанное время
                  </h3>
                  <div className="text-3xl font-bold text-red-400">
                    {totalTime}
                  </div>

                  <div className="text-sm text-gray-400 mt-1">
                    Количество отправленных отчетов:{" "}
                    {employeeSummary.reports_count}
                  </div>
                </div>
                <div className="bg-gray-700 rounded-xl p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    Средние показатели
                  </h3>
                  <div className="grid  gap-2">
                    <div>
                      <div className="text-xl font-bold text-red-400">
                        {avgTime}
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
                    {formatDate(employeeDistribution.time_period.date)}
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
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 p-4">
              <CircularDiagram data={hourDistributionData} title="" />
              <CircularDiagram data={hourDistributionDataType} title="" />
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
                          (func) => {
                            const hoursByEveryFunc1 = convertDataToNormalTime(
                              func.hours
                            );

                            return (
                              <tr key={`typical-${func.function_id}`}>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                    <span className="text-gray-300">
                                      {func.function_name}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                                  {hoursByEveryFunc1}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                                  {func.percent.toFixed(1)}%
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                                  {func.entries_count}
                                </td>
                              </tr>
                            );
                          }
                        )}
                        {employeeDistribution.distribution.by_functions.non_typical.map(
                          (func) => {

                             const hoursByEveryFunc2 = convertDataToNormalTime(
                              func.hours
                            );

                           return <tr key={`non-typical-${func.function_id}`}>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                                  <span className="text-gray-300">
                                    {func.function_name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                                {hoursByEveryFunc2}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                                {func.percent.toFixed(1)}%
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                                {func.entries_count}
                              </td>
                            </tr>
                          }
                        )}
                        {employeeDistribution.distribution.extra.map(
                          (extra) => {

                            const hoursByEveryFunc3 = convertDataToNormalTime(
                              extra.hours
                            );

                            return <tr key={`extra-${extra.deputy_id}`}>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                                  <span className="text-gray-300">
                                    {extra.deputy_name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                                {hoursByEveryFunc3}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                                {extra.percent.toFixed(1)}%
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                                {extra.entries_count}
                              </td>
                            </tr>
                          }
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
                        (report: any) => {
                          const workedHours = convertDataToNormalTime(
                            report.worked_hours
                          );

                          return (
                            <tr key={report.laborCostId}>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                                {report.laborCostId}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                                {report.function || report.deputy || "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                                {workedHours}
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
                          );
                        }
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
