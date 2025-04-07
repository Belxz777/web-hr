"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/ui/header";
import useEmployeeData from "@/hooks/useGetUserData";
import getPerformanceData from "@/components/server/performance";
import getDepartmentPerformanceData from "@/components/server/departmentPerfomance";
import { useEmployees } from "@/hooks/useEmployees";
import UniversalFooter from "@/components/buildIn/UniversalFooter";

type Employee = {
  id: number;
};

type PerformanceItem = {
  laborCostId: number;
  employeeId_id: Employee;
  departmentId: number;
  tf_id: number;
  worked_hours: number;
  normal_hours: number;
};

type DatePerformanceMap = Record<string, PerformanceItem[]>;

interface DepartmentData {
  dep_id: string;
  performance: DatePerformanceMap;
}

// Simplified and improved BarChart component
// const BarChart = ({
//   data,
//   title,
// }: {
//   data: PerformanceData[];
//   title?: string;
// }) => {
//   if (data.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[280px] text-gray-400">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-12 w-12 mb-2 opacity-50"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
//           <polyline points="14 2 14 8 20 8"></polyline>
//           <line x1="16" y1="13" x2="8" y2="13"></line>
//           <line x1="16" y1="17" x2="8" y2="17"></line>
//           <polyline points="10 9 9 9 8 9"></polyline>
//         </svg>
//         <p className="text-lg">Нет данных</p>
//       </div>
//     );
//   }

//   // Calculate totals for summary
//   const totalHours = data
//     .reduce((sum, item) => sum + Number.parseFloat(item.total_hours || "0"), 0)
//     .toFixed(1);
//   const totalReports = data.reduce(
//     (sum, item) => sum + (item.report_count || 0),
//     0
//   );
//   const avgHoursPerDay = (Number.parseFloat(totalHours) / data.length).toFixed(
//     1
//   );

//   // Find max values for scaling
//   const maxHours = Math.max(
//     ...data.map((item) => Number.parseFloat(item.total_hours || "0"))
//   );
//   const maxReports = Math.max(...data.map((item) => item.report_count || 0));

//   return (
//     <div className="space-y-4">
//       {title && <h4 className="text-sm font-medium text-gray-400">{title}</h4>}

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="mainDashboardDiv">
//           <div className="flex items-center justify-between p-4">
//             <div>
//               <p className="text-sm text-gray-400 mb-2">Всего часов</p>
//               <p className="text-2xl font-bold text-white">{totalHours}</p>
//             </div>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-8 w-8 text-gray-500 opacity-70"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <circle cx="12" cy="12" r="10"></circle>
//               <polyline points="12 6 12 12 16 14"></polyline>
//             </svg>
//           </div>
//         </div>

//         <div className="mainDashboardDiv">
//           <div className="flex items-center justify-between p-4">
//             <div>
//               <p className="text-sm text-gray-400 mb-2">Всего отчетов</p>
//               <p className="text-2xl font-bold text-white">{totalReports}</p>
//             </div>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-8 w-8 text-gray-500 opacity-70"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
//               <polyline points="14 2 14 8 20 8"></polyline>
//               <line x1="16" y1="13" x2="8" y2="13"></line>
//               <line x1="16" y1="17" x2="8" y2="17"></line>
//               <polyline points="10 9 9 9 8 9"></polyline>
//             </svg>
//           </div>
//         </div>

//         <div className="mainDashboardDiv">
//           <div className="flex items-center justify-between p-4">
//             <div>
//               <p className="text-sm text-gray-400 mb-2">Среднее в день</p>
//               <p className="text-2xl font-bold text-white">{avgHoursPerDay}</p>
//             </div>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-8 w-8 text-gray-500 opacity-70"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
//               <polyline points="17 6 23 6 23 12"></polyline>
//             </svg>
//           </div>
//         </div>
//       </div>

//       {/* Simplified Bar Chart */}
//       <div className="mainDashboardDiv">
//         <div className="p-4 border-b border-gray-700">
//           <h4 className="font-medium text-white">Почасовая статистика</h4>
//         </div>
//         <div className="p-4">
//           <div className="grid grid-cols-1 gap-4">
//             {data.map((item, index) => (
//               <div key={index} className="flex flex-col">
//                 <div className="flex justify-between items-center mb-1">
//                   <span className="text-sm text-white">{item.date}</span>
//                   <span className="text-sm text-white">
//                     {item.total_hours}ч
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-full bg-gray-700 rounded-full h-4">
//                     <div
//                       className="bg-red-500 h-4 rounded-full"
//                       style={{
//                         width: `${
//                           (Number.parseFloat(item.total_hours) / maxHours) * 100
//                         }%`,
//                       }}
//                     ></div>
//                   </div>
//                   <span className="text-xs text-gray-400 whitespace-nowrap">
//                     {item.report_count} отч.
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Detailed Data Table */}
//       <div className="mainDashboardDiv">
//         <div className="p-4 border-b border-gray-700">
//           <h4 className="font-medium text-white">Детальные данные</h4>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-700">
//                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
//                   Дата
//                 </th>
//                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
//                   Часы
//                 </th>
//                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
//                   Отчеты
//                 </th>
//                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
//                   Ср. на отчет
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((item, index) => (
//                 <tr key={index} className="border-t border-gray-700">
//                   <td className="px-4 py-3 text-sm text-white">{item.date}</td>
//                   <td className="px-4 py-3 text-sm font-medium text-white">
//                     {item.total_hours}ч
//                   </td>
//                   <td className="px-4 py-3 text-sm text-white">
//                     {item.report_count}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-white">
//                     {item.report_count > 0
//                       ? (
//                           Number.parseFloat(item.total_hours) /
//                           item.report_count
//                         ).toFixed(2) + "ч"
//                       : "-"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//             <tfoot className="bg-gray-800">
//               <tr>
//                 <td className="px-4 py-3 text-sm font-medium text-gray-400">
//                   Итого
//                 </td>
//                 <td className="px-4 py-3 text-sm font-medium text-white">
//                   {totalHours}ч
//                 </td>
//                 <td className="px-4 py-3 text-sm font-medium text-white">
//                   {totalReports}
//                 </td>
//                 <td className="px-4 py-3 text-sm font-medium text-white">
//                   {totalReports > 0
//                     ? (Number.parseFloat(totalHours) / totalReports).toFixed(
//                         2
//                       ) + "ч"
//                     : "-"}
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// const EmployeeSelector = ({
//   employees,
//   searchQuery,
//   setSearchQuery,
//   selectedEmployee,
//   handleEmployeeToggle,
//   loading,
// }: {
//   employees: any[];
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;
//   selectedEmployee: number | null;
//   handleEmployeeToggle: (id: number) => void;
//   loading: boolean;
// }) => {
//   return (
//     <div className="mainDashboardDiv">
//       <div className="p-4 border-b border-gray-700">
//         <h3 className="text-lg font-semibold text-white flex items-center gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
//             <circle cx="12" cy="7" r="4"></circle>
//           </svg>
//           Выбор сотрудника
//         </h3>
//       </div>
//       <div className="p-4">
//         <div className="relative mb-4">
//           <input
//             type="text"
//             placeholder="Поиск сотрудников..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="searchInputStyles"
//           />
//         </div>

//         {loading ? (
//           <div className="space-y-2">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="flex items-center gap-3 py-2">
//                 <div className="h-4 w-4 rounded bg-gray-700 animate-pulse"></div>
//                 <div className="h-5 w-full rounded bg-gray-700 animate-pulse"></div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="max-h-[240px] overflow-y-auto space-y-1 pr-1">
//             {employees.length > 0 ? (
//               employees.map((employee) => (
//                 <label
//                   key={employee.employeeId}
//                   className={`flex items-center gap-3 py-2 px-2 rounded-md hover:bg-gray-700 cursor-pointer transition-colors ${
//                     selectedEmployee === employee.employeeId
//                       ? "bg-gray-700"
//                       : ""
//                   }`}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedEmployee === employee.employeeId}
//                     onChange={() => handleEmployeeToggle(employee.employeeId)}
//                     className="checkboxInputStyles"
//                   />
//                   <span className="text-sm text-white">{`${employee.firstName} ${employee.lastName}`}</span>
//                   {selectedEmployee === employee.employeeId && (
//                     <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
//                       Выбран
//                     </span>
//                   )}
//                 </label>
//               ))
//             ) : (
//               <p className="text-gray-400 text-center py-4">
//                 Сотрудники не найдены
//               </p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Performance Comparison Component
// const PerformanceComparison = ({
//   departmentData,
//   employeeData,
//   employeeName,
// }: {
//   departmentData: PerformanceData[];
//   employeeData: PerformanceData[];
//   employeeName: string;
// }) => {
//   if (!employeeData.length || !departmentData.length) return null;

//   // Calculate averages
//   const deptAvgHours =
//     departmentData.reduce(
//       (sum, item) => sum + Number.parseFloat(item.total_hours || "0"),
//       0
//     ) / departmentData.length;
//   const empAvgHours =
//     employeeData.reduce(
//       (sum, item) => sum + Number.parseFloat(item.total_hours || "0"),
//       0
//     ) / employeeData.length;

//   const deptAvgReports =
//     departmentData.reduce((sum, item) => sum + (item.report_count || 0), 0) /
//     departmentData.length;
//   const empAvgReports =
//     employeeData.reduce((sum, item) => sum + (item.report_count || 0), 0) /
//     employeeData.length;

//   const percentHours = (empAvgHours / deptAvgHours) * 100;
//   const percentReports = (empAvgReports / deptAvgReports) * 100;

//   return (
//     <div className="mainDashboardDiv">
//       <div className="p-4 border-b border-gray-700">
//         <h4 className="font-medium text-white">Сравнение с отделом</h4>
//       </div>
//       <div className="p-4">
//         <div className="space-y-4">
//           <div>
//             <div className="flex justify-between mb-1">
//               <span className="text-sm text-white">Среднее кол-во часов</span>
//               <span className="text-sm text-white">
//                 {empAvgHours.toFixed(1)}ч / {deptAvgHours.toFixed(1)}ч
//               </span>
//             </div>
//             <div className="w-full bg-gray-700 rounded-full h-2.5">
//               <div
//                 className={`h-2.5 rounded-full ${
//                   percentHours >= 100 ? "bg-green-500" : "bg-red-500"
//                 }`}
//                 style={{ width: `${Math.min(100, percentHours)}%` }}
//               ></div>
//             </div>
//             <div className="text-xs text-gray-400 mt-1">
//               {employeeName} {percentHours >= 100 ? "выше" : "ниже"} среднего по
//               отделу на {Math.abs(100 - percentHours).toFixed(0)}%
//             </div>
//           </div>

//           <div>
//             <div className="flex justify-between mb-1">
//               <span className="text-sm text-white">Среднее кол-во отчетов</span>
//               <span className="text-sm text-white">
//                 {empAvgReports.toFixed(1)} / {deptAvgReports.toFixed(1)}
//               </span>
//             </div>
//             <div className="w-full bg-gray-700 rounded-full h-2.5">
//               <div
//                 className={`h-2.5 rounded-full ${
//                   percentReports >= 100 ? "bg-green-500" : "bg-red-500"
//                 }`}
//                 style={{ width: `${Math.min(100, percentReports)}%` }}
//               ></div>
//             </div>
//             <div className="text-xs text-gray-400 mt-1">
//               {employeeName} {percentReports >= 100 ? "выше" : "ниже"} среднего
//               по отделу на {Math.abs(100 - percentReports).toFixed(0)}%
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

export default function DashboardPage() {
  const { employeeData, loadingEmp } = useEmployeeData();
  // const [employeeSelectedData, setEmployeeSelectedData] = useState<
  //   PerformanceData[]
  // >([]);
  const [departmentData, setDepartmentData] = useState<DepartmentData>({
    dep_id: "",
    performance: {},
  });
  console.log("departmentData ", departmentData);
  console.log(departmentData);
  
  const [loading, setLoading] = useState(false);
  // const [activeTab, setActiveTab] = useState("department");

  // const [searchQuery, setSearchQuery] = useState("");
  // const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  // const {
  //   employees,
  //   loading: employeesLoading,
  //   error,
  // } = useEmployees(employeeData);

  // const filteredEmployees = useMemo(
  //   () =>
  //     employees?.filter((employee) =>
  //       `${employee.firstName} ${employee.lastName}`
  //         .toLowerCase()
  //         .includes(searchQuery.toLowerCase())
  //     ) || [],
  //   [searchQuery, employees]
  // );

  // const handleEmployeeToggle = (employeeId: number) => {
  //   if (selectedEmployee === employeeId) {
  //     setSelectedEmployee(null); // Deselect if already selected
  //     setActiveTab("department");
  //   } else {
  //     setSelectedEmployee(employeeId); // Select new employee
  //     setActiveTab("employee");
  //   }
  // };

  // const getPerformance = async (userId: number) => {
  //   if (!employeeData) return;

  //   try {
  //     setLoading(true);
  //     const data = await getPerformanceData(userId);
  //     setEmployeeSelectedData(data.performance);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  // useEffect(() => {
  //   if (selectedEmployee !== null) {
  //     getPerformance(selectedEmployee).catch(console.error);
  //   } else {
  //     setEmployeeSelectedData([]); // Clear data if no employee selected
  //   }
  // }, [selectedEmployee]);

  // const selectedEmployeeName =
  //   selectedEmployee !== null
  //     ? `${
  //         employees.find((e) => e.employeeId === selectedEmployee)?.firstName ||
  //         ""
  //       } ${
  //         employees.find((e) => e.employeeId === selectedEmployee)?.lastName ||
  //         ""
  //       }`
  //     : "";

  // return (
  //   <div className="mainProfileDiv">
  //     <Header title="Статистика" showPanel={false} />

  //     <main className="container mx-auto p-4">
  //       {/* Main Tabs */}
  //       <div className="mainDashboardDiv mb-6">
  //         <div className="flex border-b border-gray-700">
  //           <button
  //             className={`px-6 py-4 font-medium text-sm ${
  //               activeTab === "department"
  //                 ? "text-red-500 border-b-2 border-red-500"
  //                 : "text-gray-400 hover:text-gray-300"
  //             }`}
  //             onClick={() => setActiveTab("department")}
  //           >
  //             <div className="flex items-center gap-2">
  //               <svg
  //                 xmlns="http://www.w3.org/2000/svg"
  //                 className="h-5 w-5"
  //                 viewBox="0 0 24 24"
  //                 fill="none"
  //                 stroke="currentColor"
  //                 strokeWidth="2"
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //               >
  //                 <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
  //                 <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  //               </svg>
  //               Отдел: {departmentData?.department || "Загрузка..."}
  //             </div>
  //           </button>
  //           <button
  //             className={`px-6 py-4 font-medium text-sm ${
  //               activeTab === "employee"
  //                 ? "text-red-500 border-b-2 border-red-500"
  //                 : "text-gray-400 hover:text-gray-300"
  //             }`}
  //             onClick={() => setActiveTab("employee")}
  //             disabled={!selectedEmployee}
  //           >
  //             <div className="flex items-center gap-2">
  //               <svg
  //                 xmlns="http://www.w3.org/2000/svg"
  //                 className="h-5 w-5"
  //                 viewBox="0 0 24 24"
  //                 fill="none"
  //                 stroke="currentColor"
  //                 strokeWidth="2"
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //               >
  //                 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
  //                 <circle cx="12" cy="7" r="4"></circle>
  //               </svg>
  //               {selectedEmployee
  //                 ? `Сотрудник: ${selectedEmployeeName}`
  //                 : "Выберите сотрудника"}
  //             </div>
  //           </button>
  //         </div>
  //       </div>

  //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  //         {/* Left Column - Employee Selector */}
  //         <div className="md:col-span-1">
  //           <EmployeeSelector
  //             employees={filteredEmployees}
  //             searchQuery={searchQuery}
  //             setSearchQuery={setSearchQuery}
  //             selectedEmployee={selectedEmployee}
  //             handleEmployeeToggle={handleEmployeeToggle}
  //             loading={employeesLoading}
  //           />

  //           {/* Show comparison when employee is selected */}
  //           {selectedEmployee &&
  //             employeeSelectedData.length > 0 &&
  //             departmentData.performance.length > 0 && (
  //               <div className="mt-6">
  //                 <PerformanceComparison
  //                   departmentData={departmentData.performance}
  //                   employeeData={employeeSelectedData}
  //                   employeeName={selectedEmployeeName}
  //                 />
  //               </div>
  //             )}
  //         </div>

  //         {/* Right Column - Statistics */}
  //         <div className="md:col-span-2">
  //           {activeTab === "department" && (
  //             <>
  //               {loading ? (
  //                 <div className="mainDashboardDiv p-6">
  //                   <div className="flex flex-col items-center justify-center">
  //                     <div className="h-12 w-12 rounded-full border-4 border-gray-700 border-t-red-500 animate-spin mb-4"></div>
  //                     <p className="text-gray-400">Загрузка данных отдела...</p>
  //                   </div>
  //                 </div>
  //               ) : (
  //                 <BarChart
  //                   data={departmentData.performance || []}
  //                   title={`Статистика отдела: ${
  //                     departmentData?.department || "Неизвестно"
  //                   }`}
  //                 />
  //               )}
  //             </>
  //           )}

  //           {activeTab === "employee" && (
  //             <>
  //               {selectedEmployee ? (
  //                 loading ? (
  //                   <div className="mainDashboardDiv p-6">
  //                     <div className="flex flex-col items-center justify-center">
  //                       <div className="h-12 w-12 rounded-full border-4 border-gray-700 border-t-red-500 animate-spin mb-4"></div>
  //                       <p className="text-gray-400">
  //                         Загрузка данных сотрудника...
  //                       </p>
  //                     </div>
  //                   </div>
  //                 ) : (
  //                   <BarChart
  //                     data={employeeSelectedData}
  //                     title={`Статистика сотрудника: ${selectedEmployeeName}`}
  //                   />
  //                 )
  //               ) : (
  //                 <div className="mainDashboardDiv">
  //                   <div className="flex flex-col items-center justify-center py-12 text-gray-400">
  //                     <svg
  //                       xmlns="http://www.w3.org/2000/svg"
  //                       className="h-12 w-12 mb-2 opacity-50"
  //                       viewBox="0 0 24 24"
  //                       fill="none"
  //                       stroke="currentColor"
  //                       strokeWidth="2"
  //                       strokeLinecap="round"
  //                       strokeLinejoin="round"
  //                     >
  //                       <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
  //                       <circle cx="12" cy="7" r="4"></circle>
  //                     </svg>
  //                     <p className="text-lg">
  //                       Выберите сотрудника для просмотра статистики
  //                     </p>
  //                   </div>
  //                 </div>
  //               )}
  //             </>
  //           )}
  //         </div>
  //       </div>
  //       <UniversalFooter />
  //     </main>
  //   </div>
  // );
}
