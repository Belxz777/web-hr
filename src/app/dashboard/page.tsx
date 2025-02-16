"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/ui/header";
import useEmployeeData from "@/hooks/useGetUserData";
import getPerformanceData from "@/components/server/performance";
import getDepartmentPerformanceData from "@/components/server/departmentPerfomance";

const BarChart = ({
  data,
}: {
  data: {
    name: string;
    performance: { date: string; report_count: number; total_hours: string }[];
  }[];
}) => {
  const maxValue = Math.max(
    ...data.flatMap((emp) => emp.performance.map((p) => p.report_count))
  );
  const barWidth = 15;
  const barGap = 2;
  const employeeGap = 10;
  const chartWidth =
    data.length *
    (data[0].performance.length * (barWidth + barGap) + employeeGap);
  const chartHeight = 200;

  return (
    <svg width={chartWidth} height={chartHeight + 50} className="mt-4">
      {data.map((employee, empIndex) => (
        <g
          key={employee.name}
          transform={`translate(${
            empIndex *
            (employee.performance.length * (barWidth + barGap) + employeeGap)
          }, 0)`}
        >
          {employee.performance.map((task, taskIndex) => {
            const barHeight = (task.report_count / maxValue) * chartHeight;
            return (
              <g
                key={task.date}
                transform={`translate(${taskIndex * (barWidth + barGap)}, 0)`}
              >
                <rect
                  y={chartHeight - barHeight}
                  width={barWidth}
                  height={barHeight}
                  fill="#ef4444"
                />
                <text
                  x={barWidth / 2}
                  y={chartHeight - barHeight - 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                >
                  {task.report_count}
                </text>
                <text
                  x={barWidth / 2}
                  y={chartHeight + 15}
                  textAnchor="middle"
                  fill="white"
                  fontSize="8"
                  transform="rotate(90, 0,215)"
                >
                  {task.date}
                </text>
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
};

const PieChart = ({ percentage }: { percentage: number }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${
    (percentage / 100) * circumference
  } ${circumference}`;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="transparent"
        stroke="#374151"
        strokeWidth="10"
      />
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="transparent"
        stroke="#ef4444"
        strokeWidth="10"
        strokeDasharray={strokeDasharray}
        transform="rotate(-90 60 60)"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fill="white"
        fontSize="20"
      >
        {`${percentage}%`}
      </text>
    </svg>
  );
};

export default function DashboardPage() {
  const { employeeData, loadingEmp } = useEmployeeData();
  const [userIdValue, setUserIdValue] = useState<number>(1);
  const [employeeSelectedData, setEmployeeSelectedData] = useState([]);
  const [departmentData, setDepartmentData] = useState({});
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="flex justify-center items-center flex-col gap-5">
      {loading || loadingEmp ? (
        <p>Загрузка...</p>
      ) : (
        <>
          <div>
            <p>Инфа по департаменту</p>
            <div>
              <p>
                Название департамента:
                {departmentData?.department || "Неизвестно"}
              </p>

              <p>
                Репорты:
                {departmentData?.performance?.length || "Неизвестно"}
                <br />
                {departmentData?.performance?.map((el) => {
                  return (
                    <div key={el.date}>
                      <p>{el.date}</p>
                      <p>{el.report_count}</p>
                      <p>{el.total_hours}</p>
                    </div>
                  );
                }) || "Неизвестно"}
              </p>
            </div>
          </div>

          <div>
            <p>Выбрать инфу по сотруднику</p>
            <input
              type="number"
              value={userIdValue}
              onChange={(e) =>
                setUserIdValue(parseInt(e.target.value, 10) || 1)
              }
            />
            <button onClick={() => getPerformance(userIdValue)}>
              Применить
            </button>

            <p>Инфа по сотруднику</p>

            {employeeSelectedData.length > 0 ? (
              employeeSelectedData.map((item) => (
                <div key={item.date}>
                  <p>{item.date}</p>
                  <p>{item.report_count}</p>
                  <p>{item.total_hours}</p>
                </div>
              ))
            ) : (
              <p>Нет данных</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// return (
//   <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 text-gray-100">
//     <Header employeeData={employeeData} title="Дашборд начальника отдела" />

//     <main className="container mx-auto p-4">
//       <section className="mb-8">
//         <h2 className="text-xl font-bold mb-4">
//           Выполненные задачи сотрудников по дням
//         </h2>
//         <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
//           {/* <BarChart data={employeesData} /> */}
//         </div>
//         <p className="mt-2 text-sm text-gray-400">
//           Нажмите на столбец, чтобы увидеть подробную информацию о задачах за
//           этот день.
//         </p>
//       </section>

//       <section>
//         <h2 className="text-xl font-bold mb-4">Занятость сотрудников</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//           {/* {employeesData.map((employee) => (
//             <div
//               key={employee.id}
//               className="bg-gray-800 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-gray-700 transition-colors"
//               onClick={() => handleEmployeeClick(employee)}
//             >
//               <h3 className="text-lg font-semibold mb-2">{employee.name}</h3>
//               <PieChart percentage={employee.busyPercentage} />
//               <p className="mt-2">Занятость: {employee.busyPercentage}%</p>
//             </div>
//           ))} */}
//         </div>
//         <p className="mt-2 text-sm text-gray-400">
//           Нажмите на карточку сотрудника, чтобы увидеть подробную информацию о
//           его занятости.
//         </p>
//       </section>

//       {selectedEmployee && (
//         <section className="mt-8 bg-gray-800 rounded-lg p-4">
//           <h2 className="text-xl font-bold mb-4">
//             Подробная информация о занятости: {selectedEmployee.name}
//           </h2>
//           <h3 className="text-lg font-semibold mb-2">Текущие задачи:</h3>
//           <ul className="list-disc list-inside">
//             {selectedEmployee.detailedTasks.map((task) => (
//               <li key={task.id} className="mb-2">
//                 <span className="font-medium">{task.name}</span> - Статус:{" "}
//                 {task.status}, Дедлайн: {task.deadline}
//               </li>
//             ))}
//           </ul>
//           <button
//             className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//             onClick={() => setSelectedEmployee(null)}
//           >
//             Закрыть
//           </button>
//         </section>
//       )}

//       {selectedDate && (
//         <section className="mt-8 bg-gray-800 rounded-lg p-4">
//           <h2 className="text-xl font-bold mb-4">Задачи на {selectedDate}</h2>
//           <ul className="list-disc list-inside">
//             {employeesData.map((employee) => {
//               const tasksForDate = employee.performance.find(
//                 (t) => t.date === selectedDate
//               );
//               return tasksForDate ? (
//                 <li key={employee.id} className="mb-2">
//                   <span className="font-medium">{employee.name}</span>:{" "}
//                   {tasksForDate.report_count} задач
//                 </li>
//               ) : null;
//             })}
//           </ul>
//           <button
//             className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//             onClick={() => setSelectedDate(null)}
//           >
//             Закрыть
//           </button>
//         </section>
//       )}
//     </main>
//   </div>
// );
