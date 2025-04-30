"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import UniversalFooter from "@/components/buildIn/UniversalFooter";
import getDepartmentPerformanceData from "@/components/server/departmentPerfomance";
import useEmployeeData from "@/hooks/useGetUserData";

export default function DepartmentDataDisplay() {
  const [departmentData, setDepartmentData] = useState<any>(null);
  const [activeDate, setActiveDate] = useState<any>(null);
  const { employeeData } = useEmployeeData();

  useEffect(() => {
    const getDepartmentPerformance = async () => {
      if (!employeeData?.user?.departmentid) return;
      try {
        const data = await getDepartmentPerformanceData(
          employeeData.user.departmentid
        );
        setDepartmentData(data || null);
        if (data && data.performance) {
          setActiveDate(Object.keys(data.performance)[0] || null);
        }
      } catch (error) {
        console.log("Error fetching department performance:", error);
      }
    };
    getDepartmentPerformance();
  }, [employeeData]);

  if (!departmentData || !activeDate) {
    return (
      <div className="mainProfileDiv">
        <Header title="Данные отдела" showPanel={false} />
        <main className="container mx-auto p-4 flex-grow">
          <p className="text-gray-300">Загрузка данных...</p>
        </main>
        <UniversalFooter />
      </div>
    );
  }

  const totalEntries = Object.values(departmentData.performance).reduce(
    (sum: any, entries: any) => sum + entries.length,
    0
  );

  const totalWorkedHours = Object.values(departmentData.performance).reduce(
    (sum: any, entries: any) =>
      sum + entries.reduce((s: any, entry: any) => s + entry.worked_hours, 0),
    0
  );

  const uniqueEmployees = new Set(
    Object.values(departmentData.performance).flatMap((entries: any) =>
      entries.map((entry: any) => entry.employeeId_id)
    )
  );

  return (
    <div className="mainProfileDiv">
      <Header title="Данные отдела" showPanel={false} />
      <main className="container mx-auto p-4 flex-grow">
        <div className="max-w-6xl mx-auto mt-6 bg-gray-800 p-6 rounded-xl shadow-lg">
          <h1 className="text-center text-gray-300 text-2xl font-bold mb-6 flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            Данные отдела (ID: {departmentData.dep_id})
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Всего записей</p>
                  <p className="text-2xl font-bold text-gray-100">
                    {String(totalEntries)}
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-500 opacity-70"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Всего часов</p>
                  <p className="text-2xl font-bold text-gray-100">
                    {(totalWorkedHours as number).toFixed(1)}
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-500 opacity-70"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">
                    Уникальных сотрудников
                  </p>
                  <p className="text-2xl font-bold text-gray-100">
                    {uniqueEmployees.size}
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-500 opacity-70"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(departmentData.performance).map((date: any) => (
                <button
                  key={date}
                  onClick={() => setActiveDate(date)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeDate === date
                      ? "bg-red-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {date}
                  <span className="ml-1 bg-gray-600 text-gray-200 text-xs px-2 py-0.5 rounded-full">
                    {departmentData.performance[date].length}
                  </span>
                </button>
              ))}
            </div>

            <div className="bg-gray-700 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-600">
                <h2 className="text-lg font-medium text-gray-200">
                  Данные за {activeDate}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                        Сотрудник ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                        Отдел ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                        TF ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                        Отработано
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                        Норма
                      </th>
                  
                    </tr>
                  </thead>
                  <tbody>
                    {departmentData.performance[activeDate].map((item: any) => (
                      <tr
                        key={item.laborCostId}
                        className="border-t border-gray-700"
                      >
                        <td className="px-4 py-3 text-sm text-gray-200">
                          {item.laborCostId}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-200">
                          {item.employeeId_id}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-200">
                          {item.departmentId}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-200">
                          {item.functionId  ? item.functionId : item.deputyId}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-200">
                          {item.worked_hours}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-200">
                          {item.normal_hours}
                        </td>
            
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 bg-gray-700 p-4 rounded-xl">
              <h3 className="text-lg font-medium text-gray-200 mb-4">
                Сводка за {activeDate}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Всего записей</p>
                  <p className="text-xl font-semibold text-gray-100">
                    {departmentData.performance[activeDate].length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">
                    Всего отработано часов
                  </p>
                  <p className="text-xl font-semibold text-gray-100">
                    {(
                      departmentData.performance[activeDate].reduce(
                        (sum: any, item: any) => sum + item.worked_hours,
                        0
                      ) as number
                    ).toFixed(1)}
                  </p>
                </div>
         
              </div>
            </div>
          </div>
        </div>
      </main>
      <UniversalFooter />
    </div>
  );
}
