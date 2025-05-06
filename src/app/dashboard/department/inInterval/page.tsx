"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import UniversalFooter from "@/components/buildIn/UniversalFooter";
import Link from "next/link";
import getAllDepartments from "@/components/server/departments";
import { DailyStats, Department } from "@/types";
import analyticsDepartmentInDayPercentagerInInterval from "@/components/server/analyticsDepartmentInDayPercentagerInInterval";
import analyticsDepartmentInInterval from "@/components/server/analyticsDepartmentInInterval";
import { DepartmentStatsInDay } from "@/components/dashborad/DepartmentStatsInDay";
import { DepartmentStatsInDayPer } from "@/components/dashborad/DepartmentStatsInDayPer";
import { EmployeeStats } from "@/components/dashborad/EmployeeStats";
import { TopFunctions } from "@/components/dashborad/TopFunctions";

const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};


export default function InInterval() {
  const [dataInDay, setDataInDay] = useState<DailyStats | null>(null);
  const [deps, setDeps] = useState<Department[]>([]);
  const [dataInDayPer, setDataInDayPer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [selectedDep, setSelectedDep] = useState<number | null>(null);

  const fetchDepartments = async () => {
    try {
      const allDepartments = await getAllDepartments();
      setDeps(allDepartments);
      if (allDepartments.length > 0) {
        setSelectedDep(allDepartments[0].departmentId);
      }
    } catch (err) {
      console.error("Ошибка при загрузке департаментов:", err);
    }
  };
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchData = async () => {
    if (!selectedDep) return;

    try {
      setLoading(true);
      setError(null);
      const data = await analyticsDepartmentInInterval(
        selectedDep,
        startDate,
        endDate
      );
      const dataPer = await analyticsDepartmentInDayPercentagerInInterval(
        selectedDep,
        startDate,
        endDate
      );
      setDataInDay(data);
      setDataInDayPer(dataPer);
    } catch (err) {
      setError("Ошибка при загрузке данных");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const handleDepChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDep(Number(e.target.value));
  };

  const handleApply = () => {
    fetchData();
  };

  const formatDisplayDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="mainProfileDiv">
      <Header title="Аналитика за промежуток времени" showPanel={false} />

      <div className="bg-gray-800 rounded-2xl p-4 m-2 space-y-4 flex justify-around items-center">
        <div className="bg-gray-900 rounded-2xl">
          <Link href="/dashboard/department/perDay">
            <h2 className="text-xl font-bold m-3">Статистика отдела за день</h2>
          </Link>
        </div>
        <div className="bg-gray-700 rounded-2xl cursor-pointer">
          <Link href="/dashboard/department/inInterval">
            <h2 className="text-xl font-bold m-3">
              Статистика отдела за промежуток времени
            </h2>
          </Link>
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl p-4 m-2 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded-xl p-4">
            <div className="text-white font-medium mb-2">Начальная дата</div>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="bg-gray-600 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <div className="text-gray-400 mt-2 text-sm">
              Выбрано: {formatDisplayDate(startDate)}
            </div>
          </div>

          <div className="bg-gray-700 rounded-xl p-4">
            <div className="text-white font-medium mb-2">Конечная дата</div>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              min={startDate}
              className="bg-gray-600 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <div className="text-gray-400 mt-2 text-sm">
              Выбрано: {formatDisplayDate(endDate)}
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-xl p-4">
          <div className="text-white font-medium mb-2">Выбор департамента</div>
          <select
            value={selectedDep || ""}
            onChange={handleDepChange}
            className="bg-gray-600 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          >
            {deps.map((dep) => (
              <option key={dep.departmentId} value={dep.departmentId}>
                {dep.departmentName}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleApply}
          disabled={loading}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg w-full transition-colors ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Загрузка..." : "Применить"}
        </button>
      </div>

      <main className="my-8 space-y-8">
        {loading ? (
          <div>Загрузка данных...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : dataInDay ? (
          <>
            <DepartmentStatsInDay data={dataInDay.department_stats} />
            <DepartmentStatsInDayPer data={dataInDayPer?.distribution} />
            <EmployeeStats data={dataInDay.employee_stats} />
            <TopFunctions data={dataInDayPer?.distribution} />
          </>
        ) : (
          <div className="text-gray-500 text-center py-8">
            Выберите параметры и нажмите "Применить" для загрузки данных
          </div>
        )}
      </main>

      <UniversalFooter />
    </div>
  );
}
