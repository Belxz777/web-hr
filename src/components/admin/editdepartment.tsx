// "use client"

// import type React from "react"
// import { useState } from "react"
// import type { Department, Job, Functions } from "./index"

// interface EditDepartmentFormProps {
//   department: Department
//   jobs: Job[]
//   onBack: () => void
//   onSubmit: (data: { id: number; jobsList: number[]; }) => Promise<void>
//   loading?: boolean
// }

// export default function EditDepartmentForm({
//   department,
//   jobs,
//   onBack,
//   onSubmit,
//   loading = false,
// }: EditDepartmentFormProps) {
//   const [selectedJobs, setSelectedJobs] = useState<number[]>(department.jobsList || [])

//   const toggleJobSelection = (jobId: number) => {
//     setSelectedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
//   }


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     await onSubmit({
//       id: department.departmentId,
//       jobsList: selectedJobs
//     })
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center gap-2 mb-4">
//         <button onClick={onBack} className="text-blue-600" disabled={loading}>
//           ← Назад
//         </button>
//         <h2 className="text-xl font-bold">Редактирование отдела: {department.departmentName}</h2>
//       </div>

//       <div className="p-4 bg-gray-50 border rounded">
//         <div className="text-sm text-gray-600">ID: {department.departmentId}</div>
//         <div className="text-sm text-gray-600">Название: {department.departmentName}</div>
//         {department.departmentDescription && (
//           <div className="text-sm text-gray-600">Описание: {department.departmentDescription}</div>
//         )}
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Выбор должностей */}
//         <div>
//           <h3 className="font-medium mb-3">Выбрать должности принадлежащие отделу(jobsList):</h3>
//           <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded p-3">
//             {jobs.length === 0 ? (
//               <div className="text-gray-500 text-sm">Должности не найдены</div>
//             ) : (
//               jobs.map((job) => (
//                 <label key={job.jobId} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
//                   <input
//                     type="checkbox"
//                     checked={selectedJobs.includes(job.jobId)}
//                     onChange={() => toggleJobSelection(job.jobId)}
//                     disabled={loading}
//                   />
//                   <div>
//                     <div className="font-medium">{job.jobName}</div>
//                     <div className="text-sm text-gray-500">ID: {job.jobId}</div>
//                   </div>
//                 </label>
//               ))
//             )}
//           </div>
//           <div className="text-sm text-gray-600 mt-1">Выбрано: {selectedJobs.length} должностей</div>
//         </div>

    
//         <div className="flex gap-3">
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded disabled:opacity-50"
//             disabled={loading}
//           >
//             {loading ? "Сохранение..." : "Сохранить изменения"}
//           </button>
//           <button
//             type="button"
//             onClick={onBack}
//             className="px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400 rounded"
//             disabled={loading}
//           >
//             Отмена
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }
