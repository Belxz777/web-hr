// "use client";

// import type React from "react";
// import { useEffect, useState, useMemo } from "react";
// import { Header } from "@/components/ui/header";
// import UniversalFooter from "@/components/buildIn/UniversalFooter";
// import analyticsDepartmentsInDay from "@/components/server/analyticsDepartmentsInDay";
// import {  DepartmentsData } from "@/types";
// import { DepartmentCard } from "@/components/dashboard/DepartmentCard";
// import { SummaryStats } from "@/components/dashboard/SummaryStats";

// const formatDisplayDate = (dateString: string) => {
//   const [year, month, day] = dateString.split("-");
//   return `${day}.${month}.${year}`;
// };

// const getCurrentDate = () => {
//   const now = new Date()
//   const year = now.getFullYear()
//   const month = String(now.getMonth() + 1).padStart(2, "0")
//   const day = String(now.getDate()).padStart(2, "0")
//   return `${year}-${month}-${day}`
// }

// const EmptyState = ({ date }: { date: string }) => (
//   <div className="bg-gray-800 rounded-2xl p-8 text-center animate-fade-in">
//     <div className="text-5xl text-red-500 mb-4">📊</div>
//     <h3 className="text-xl font-bold text-gray-200 mb-2">
//       Нет данных за выбранный период
//     </h3>
//     <p className="text-gray-400">
//       За {formatDisplayDate(date)} нет данных по отработанным часам в отделах.
//     </p>
//   </div>
// );

// export default function DepartmentStats() {
//   const [depsData, setDepsData] = useState<DepartmentsData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedDate, setSelectedDate] = useState(getCurrentDate());

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const data = await analyticsDepartmentsInDay(selectedDate);
//         if (!data || !data.departments) {
//           throw new Error("Ошибка получения данных");
//         }
//         setDepsData(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Неизвестная ошибка");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [selectedDate]);

//   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedDate(e.target.value);
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const hasDepartments = useMemo(
//     () => depsData?.departments.length || 0 > 0,
//     [depsData]
//   );

//   return (
//     <div className="mainProfileDiv bg-gray-900 min-h-screen flex flex-col">
//       <Header title="Статистика отделов" showPanel={false} />
//       <main className="container mx-auto p-4 flex-grow">
//         <div className="max-w-6xl mx-auto">
//           <div className="bg-gray-800 rounded-2xl p-4 mb-6">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//               <h2 className="text-xl font-bold text-gray-200 mb-4 md:mb-0">
//                 Статистика по отделам за {formatDisplayDate(selectedDate)}
//               </h2>
//               <div className="flex items-center space-x-2">
//                 <label htmlFor="date-select" className="text-gray-300">
//                   Дата:
//                 </label>
//                 <input
//                   id="date-select"
//                   type="date"
//                   value={selectedDate}
//                   onChange={handleDateChange}
//                   className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
//                 />
//               </div>
//             </div>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center p-8">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
//             </div>
//           ) : error ? (
//             <div className="bg-red-900 text-red-100 p-4 rounded-xl text-center animate-fade-in">
//               {error}
//             </div>
//           ) : depsData ? (
//             <>
//               <SummaryStats data={depsData} />
//               <div className="mb-6">
//                 <h3 className="text-xl font-bold text-gray-200 mb-4">
//                   Отделы ({depsData.total_departments})
//                 </h3>
//                 {hasDepartments ? (
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {depsData.departments.map((department) => (
//                       <DepartmentCard
//                         key={department.department_id}
//                         department={department}
//                       />
//                     ))}
//                   </div>
//                 ) : (
//                   <EmptyState date={selectedDate} />
//                 )}
//               </div>
//               <div className="flex justify-end space-x-4 mb-6">
//                 <button
//                   onClick={handlePrint}
//                   className="px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-xl hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
//                   aria-label="Печать статистики"
//                 >
//                   Печать
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="text-gray-500 text-center py-8 animate-fade-in">
//               Нет данных для выбранных параметров
//             </div>
//           )}
//         </div>
//       </main>
//       <UniversalFooter />
//     </div>
//   );
// }

// const styles = `
//   @keyframes fadeIn {
//     from { opacity: 0; }
//     to { opacity: 1; }
//   }
//   .animate-fade-in {
//     animation: fadeIn 0.5s ease-in;
//   }
// `;
// if (typeof document !== "undefined") {
//   const styleSheet = document.createElement("style");
//   styleSheet.textContent = styles;
//   document.head.appendChild(styleSheet);
// }
