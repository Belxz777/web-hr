"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/ui/header";
import getEmployees from "@/components/server/emps_get";
import { host } from "@/types";
import useEmployeeData from "@/hooks/useGetUserData";
import { useEmployees } from "@/hooks/useEmployees";

export default function DownloadReportPage() {
  const { employeeData } = useEmployeeData();
  const { employees, loading, error } = useEmployees(employeeData);

  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmployees = useMemo(
    () =>
      employees?.filter(
        (employee) =>
          !selectedEmployees.includes(employee.employeeId) &&
          `${employee.firstName} ${employee.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      ) || [],
    [searchQuery, employees, selectedEmployees]
  );

  const handleEmployeeToggle = (employeeId: number) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const downloadExcel = async () => {
    const body = {
      employee_ids: selectedEmployees,
      from_date: startDate,
      end_date: endDate,
    };
console.log("body", body);
    try {
      const response = await fetch(`http://localhost:3000/api/download/persise`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        }
    });

      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "report.xlsx";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);
    }
  };

  const handleDownload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedEmployees.length === 0)
      return alert("Выберите хотя бы одного сотрудника.");
    if (!startDate || !endDate) return alert("Выберите даты.");

    downloadExcel();
  };

  const handleRemoveSelected = (employeeId: number) => {
    setSelectedEmployees((prev) => prev.filter((id) => id !== employeeId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 text-gray-100">
      <Header employeeData={employeeData} title="Настройки" />

      {loading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <svg
            className="animate-spin h-10 w-10 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      ) : (
        <main className="container mx-auto p-4">
          <form
            onSubmit={handleDownload}
            className="bg-gray-800 rounded-xl p-6 max-w-2xl mx-auto"
          >
            <section className="mb-6">
              <h2 className="text-xl font-bold mb-4">Выберите сотрудников</h2>
              <input
                type="text"
                placeholder="Поиск сотрудников..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-red-500"
              />
              <div className="max-h-60 overflow-y-auto mt-4">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.slice(0, 5).map((employee) => (
                    <label
                      key={employee.employeeId}
                      className="flex items-center space-x-3 py-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(
                          employee.employeeId
                        )}
                        onChange={() =>
                          handleEmployeeToggle(employee.employeeId)
                        }
                        className="form-checkbox h-5 w-5 text-red-600"
                      />
                      <span>{`${employee.firstName} ${employee.lastName}`}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-2">
                    Сотрудники не найдены
                  </p>
                )}

                {filteredEmployees.length > 5 && (
                  <span className="text-gray-500 mt-2">и другие...</span>
                )}
              </div>

              {selectedEmployees.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">
                    Добавленные сотрудники:
                  </h3>
                  <div className="max-h-60 overflow-y-auto mt-2">
                    {selectedEmployees.length > 5
                      ? employees
                          .filter((employee) =>
                            selectedEmployees.includes(employee.employeeId)
                          )
                          .slice(0, 5)
                          .map((employee) => (
                            <div
                              key={employee.employeeId}
                              className="flex items-center justify-between py-2"
                            >
                              <span>{`${employee.firstName} ${employee.lastName}`}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveSelected(employee.employeeId)
                                }
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                              >
                                Удалить
                              </button>
                            </div>
                          ))
                      : employees
                          .filter((employee) =>
                            selectedEmployees.includes(employee.employeeId)
                          )
                          .map((employee) => (
                            <div
                              key={employee.employeeId}
                              className="flex items-center justify-between py-2"
                            >
                              <span>{`${employee.firstName} ${employee.lastName}`}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveSelected(employee.employeeId)
                                }
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                              >
                                Удалить
                              </button>
                            </div>
                          ))}
                  </div>
                  {selectedEmployees.length > 5 && (
                    <span className="text-gray-500 mt-2">и другие...</span>
                  )}
                </div>
              )}
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-bold mb-4">Выберите период</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Начальная дата
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Конечная дата
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
              </div>
            </section>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              disabled={
                selectedEmployees.length === 0 || !startDate || !endDate
              }
            >
              Скачать отчет
            </button>
          </form>
        </main>
      )}
    </div>
  );
}
