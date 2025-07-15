// Could be useful

// import { Employee } from "@/types";

// export default function Departments({
//   handleDepartmentSubmit,
//   setDepartmentForm,
//   departmentForm,
//   employees,
// }: {
//   handleDepartmentSubmit: (e: React.FormEvent) => void;
//   setDepartmentForm: (departmentForm: any) => void;
//   departmentForm: any;
//   employees: Employee[];
// }) {
//   return (
//     <>
//       <section className="bg-gray-800 rounded-lg p-6 mb-6">
//         <h2 className="text-xl font-bold mb-4 text-white">
//           Создание нового департамента
//         </h2>
//         <form onSubmit={handleDepartmentSubmit} className="space-y-4">
//           <div>
//             <label htmlFor="departmentName" className="labelStyles mb-2">
//               Название департамента
//             </label>
//             <input
//               id="departmentName"
//               type="text"
//               required
//               value={departmentForm.name}
//               onChange={(e) =>
//                 setDepartmentForm((prev: { name: string }) => ({
//                   ...prev,
//                   name: e.target.value,
//                 }))
//               }
//               className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
//               placeholder="Введите название департамента"
//             />
//           </div>
//           <div>
//             <label htmlFor="departmentDescription" className="labelStyles mb-2">
//               Описание департамента
//             </label>
//             <textarea
//               id="departmentDescription"
//               required
//               value={departmentForm.description}
//               onChange={(e) =>
//                 setDepartmentForm((prev: { description: string }) => ({
//                   ...prev,
//                   description: e.target.value,
//                 }))
//               }
//               className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
//               rows={4}
//               placeholder="Введите описание департамента"
//             />
//           </div>
//           <div>
//             <label htmlFor="departmentHead" className="labelStyles mb-2">
//               Начальник департамента
//             </label>
//             <select
//               id="departmentHead"
//               value={departmentForm.headId}
//               onChange={(e) =>
//                 setDepartmentForm((prev: { headId: number }) => ({
//                   ...prev,
//                   headId: e.target.value,
//                 }))
//               }
//               className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
//             >
//               <option value="">Выберите начальника департамента</option>
//               {Array.isArray(employees) &&
//                 employees?.map((employee: Employee) => (
//                   <option key={employee.employeeId} value={employee.employeeId}>
//                     {employee.firstName} {employee.lastName} (поз.{" "}
//                     {employee.position})
//                   </option>
//                 ))}
//             </select>
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition-colors"
//           >
//             Создать департамент
//           </button>
//         </form>
//       </section>
//     </>
//   );
// }
