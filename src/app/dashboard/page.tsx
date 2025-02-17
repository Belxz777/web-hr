"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/ui/header";
import useEmployeeData from "@/hooks/useGetUserData";
import getPerformanceData from "@/components/server/performance";
import getDepartmentPerformanceData from "@/components/server/departmentPerfomance";


type PerformanceData = {
  date: string
  report_count: number
  total_hours: string
}

type DepartmentData = {
  department: string
  performance: PerformanceData[]
}

type EmployeeData = {
  employee_id: number
  name: string
  performance: PerformanceData[]
}

const BarChart = ({ data }: { data: PerformanceData[] }) => {
  const maxValue = Math.max(...data?.map(d => parseFloat(d.total_hours)))
  const barWidth = 60
  const gap = 20
  const width = (barWidth + gap) * data.length
  const height = 200
  const padding = 40

  return (
    <svg width={width + padding * 2} height={height + padding * 2} className="mx-auto">
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
        const barHeight = (parseFloat(item.total_hours) / maxValue) * height
        return (
          <g key={index} transform={`translate(${padding + index * (barWidth + gap)}, ${padding})`}>
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
        )
      })}
    </svg>
  )
}



const MetricsCard = ({ title, value, subtitle }: { title: string, value: string, subtitle: string }) => (
  <div className="bg-gray-800 border border-gray-700 rounded shadow p-4">
    <h3 className="text-sm text-gray-400 mb-2">{title}</h3>
    <div className="text-2xl font-bold mb-1 text-white">{value}</div>
    <div className="text-sm text-gray-500">{subtitle}</div>
  </div>
)

export default function DashboardPage() {
  const { employeeData, loadingEmp } = useEmployeeData();
  const [userIdValue, setUserIdValue] = useState<number>(1);
  const [employeeSelectedData, setEmployeeSelectedData] = useState([]);
  const [departmentData, setDepartmentData] = useState({});
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null)

  const handleSearch = () => {
    const employee = employeesData.find(emp =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_id.toString() === searchTerm
    )
    setSelectedEmployee(employee || null)
  }

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

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 text-gray-100">
      <Header title='Статистика' employeeData={employeeData} />

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 border border-gray-700 rounded shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold bg-gray-700 text-white px-3 py-1 rounded">
                ОБЩАЯ  СТАТИСТИКА ОТДЕЛА: {departmentData?.department || "Неизвестно"}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <BarChart data={departmentData.performance || []} />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Поиск сотрудника по имени или ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Поиск
            </button>
          </div>
        </div>
      </main >
    </div>
  )

}
{/* // <div className="flex justify-center items-center flex-col gap-5">
//   {loading || loadingEmp ? (
//     <p>Загрузка...</p>
//   ) : (
//     <>
//       <div>
//         <p>Инфа по департаменту</p>
//         <div>
//           <p>
//             Название департамента:
//             {departmentData?.department || "Неизвестно"}
//           </p>

//           <p>
//             Репорты:
//             {departmentData?.performance?.length || "Неизвестно"}
//             <br />
//             {departmentData?.performance?.map((el) => {
//               return (
//                 <div key={el.date}>
//                   <p>{el.date}</p>
//                   <p>{el.report_count}</p>
//                   <p>{el.total_hours}</p>
//                 </div>
//               );
//             }) || "Неизвестно"}
//           </p>
//         </div>
//       </div>

//       <div>
//         <p>Выбрать инфу по сотруднику</p>
//         <input
//           type="number"
//           value={userIdValue}
//           onChange={(e) =>
//             setUserIdValue(parseInt(e.target.value, 10) || 1)
//           }
//         />
//         <button onClick={() => getPerformance(userIdValue)}>
//           Применить
//         </button>

//         <p>Инфа по сотруднику</p>

//         {employeeSelectedData.length > 0 ? (
//           employeeSelectedData.map((item) => (
//             <div key={item.date}>
//               <p>{item.date}</p>
//               <p>{item.report_count}</p>
//               <p>{item.total_hours}</p>
//             </div>
//           ))
//         ) : (
//           <p>Нет данных</p>
//         )}
//       </div>
//     </>
//   )}
// </div> */}