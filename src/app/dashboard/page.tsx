"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/ui/header";
import useEmployeeData from "@/hooks/useGetUserData";
import getPerformanceData from "@/components/server/performance";
import getDepartmentPerformanceData from "@/components/server/departmentPerfomance";
import { useEmployees } from "@/hooks/useEmployees";

type PerformanceData = {
  date: string;
  report_count: number;
  total_hours: string;
};

type DepartmentData = {
  department: string;
  performance: PerformanceData[];
};

type EmployeeData = {
  employee_id: number;
  name: string;
  performance: PerformanceData[];
};

const BarChart = ({ data }: { data: PerformanceData[] }) => {
  const maxValue = Math.max(...data?.map((d) => parseFloat(d.total_hours)));
  const barWidth = 60;
  const gap = 20;
  const width = (barWidth + gap) * data.length;
  const height = 200;
  const padding = 40;

  if (data.length === 0) {
    return <text className="text-2xl ml-2">
      Нет данных
    </text>
  }

  return (
    <svg
      width={width + padding * 2}
      height={height + padding * 2}
      className="mx-auto"
    >
      {/* Y axis */}
      <line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={height + padding}
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* X axis */}
      <line
        x1={padding}
        y1={height + padding}
        x2={width + padding}
        y2={height + padding}
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Bars */}
      {data?.map((item, index) => {
        const barHeight = (parseFloat(item.total_hours) / maxValue) * height;
        return (
          <g
            key={index}
            transform={`translate(${padding + index * (barWidth + gap)
              }, ${padding})`}
          >
            <rect
              x={0}
              y={height - barHeight}
              width={barWidth}
              height={barHeight}
              fill="#ef4444"
              className="hover:fill-red-600 transition-colors"
            />
            <text
              x={barWidth / 2}
              y={height - barHeight - 5}
              textAnchor="middle"
              fill="currentColor"
              fontSize="12"
            >
              {item.total_hours}
            </text>
            <text
              x={barWidth / 2}
              y={height + 20}
              textAnchor="middle"
              fill="currentColor"
              fontSize="12"
            >
              {item.date}
            </text>
            <text
              x={barWidth / 2}
              y={height - barHeight - 20}
              textAnchor="middle"
              fill="currentColor"
              fontSize="12"
            >
              {item.report_count} отч.
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// const MetricsCard = ({
//   title,
//   value,
//   subtitle,
// }: {
//   title: string;
//   value: string;
//   subtitle: string;
// }) => (
//   <div className="bg-gray-800 border border-gray-700 rounded shadow p-4">
//     <h3 className="text-sm text-gray-400 mb-2">{title}</h3>
//     <div className="text-2xl font-bold mb-1 text-white">{value}</div>
//     <div className="text-sm text-gray-500">{subtitle}</div>
//   </div>
// );

export default function DashboardPage() {
  const { employeeData, loadingEmp } = useEmployeeData();
  const [employeeSelectedData, setEmployeeSelectedData] = useState<
    PerformanceData[]
  >([]);
  const [departmentData, setDepartmentData] = useState<DepartmentData>({});
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const {
    employees,
    loading: employeesLoading,
    error,
  } = useEmployees(employeeData);

  const filteredEmployees = useMemo(
    () =>
      employees?.filter(
        (employee) =>
          selectedEmployee !== employee.employeeId &&
          `${employee.firstName} ${employee.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      ) || [],
    [searchQuery, employees, selectedEmployee]
  );

  const handleEmployeeToggle = (employeeId: number) => {
    if (selectedEmployee === employeeId) {
      setSelectedEmployee(null); // Deselect if already selected
    } else {
      setSelectedEmployee(employeeId); // Select new employee
    }
  };

  const getPerformance = async (userId: number) => {
    if (!employeeData) return;

    try {
      setLoading(true);
      const data = await getPerformanceData(userId);
      setEmployeeSelectedData(data.performance);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getDepartmentPerformance = async () => {
      if (!employeeData?.departmentid) return;
      try {
        setLoading(true);
        const data = await getDepartmentPerformanceData(
          employeeData.departmentid
        );
        setDepartmentData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getDepartmentPerformance();
  }, [employeeData]);

  useEffect(() => {
    if (selectedEmployee !== null) {
      getPerformance(selectedEmployee).catch(console.error);
    } else {
      setEmployeeSelectedData([]); // Clear data if no employee selected
    }
  }, [selectedEmployee]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 text-gray-100">
      <Header title="Статистика" />

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 border border-gray-700 rounded shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold bg-gray-700 text-white px-3 py-1 rounded">
                ОБЩАЯ СТАТИСТИКА ОТДЕЛА:{" "}
                {departmentData?.department || "Неизвестно"}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <BarChart data={departmentData.performance || []} />
            </div>
          </div>
        </div>

        <div className="my-6">
          <div className="flex gap-4 flex-col space-x-2">
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
                      checked={selectedEmployee === employee.employeeId}
                      onChange={() => handleEmployeeToggle(employee.employeeId)}
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

            {selectedEmployee !== null && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Выбранный сотрудник:</h3>
                <div className="bg-gray-800 border border-gray-700 rounded shadow p-4 w-full overflow-x-auto">
                  <h3 className="font-semibold bg-gray-700 text-white px-3 py-1 rounded">
                    СТАТИСТИКА:{" "}
                    {employees.find((e) => e.employeeId === selectedEmployee)
                      ?.firstName +
                      " " +
                      employees.find((e) => e.employeeId === selectedEmployee)
                        ?.lastName || "Неизвестно"}
                  </h3>
                  <BarChart data={employeeSelectedData} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
