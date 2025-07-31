// "use client"

// import { Job, Responsibility } from "@/types" // Assuming Responsibility is defined in your types
// import type React from "react"
// import { useState, useEffect } from "react"

// interface EditJobFormProps {
//   job: Job
//   responsibilities: Responsibility[] // Pass the list of responsibilities
//   onBack: () => void
//   onSubmit: (data: { id: number; deputy: number }) => Promise<void>
//   loading?: boolean
// }

// export default function EditJobForm({ job, responsibilities, onBack, onSubmit, loading = false }: EditJobFormProps) {
//   const [selectedResponsibility, setSelectedResponsibility] = useState<number>(0)

//   useEffect(() => {
//     // Set the initial selected responsibility if it exists
//     if (job.deputy) {
//       setSelectedResponsibility(job.deputy)
//     }
//   }, [job.deputy])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     await onSubmit({
//       id: job.id,
//       deputy: selectedResponsibility,
//     })
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center gap-2 mb-4">
//         <button onClick={onBack} className="text-blue-600" disabled={loading}>
//           ← Назад
//         </button>
//         <h2 className="text-xl font-bold">Редактирование должности: {job.name}</h2>
//       </div>

//       <div className="p-4 bg-gray-50 border rounded">
//         <div className="text-sm text-gray-600">ID: {job.id}</div>
//         <div className="text-sm text-gray-600">Названиe должности: {job.name}</div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Выбрать новую основную обязанность должности:</label>
//           <select
//             value={selectedResponsibility}
//             onChange={(e) => setSelectedResponsibility(Number(e.target.value))}
//             className="w-full p-2 border border-gray-300 rounded"
//             required
//             disabled={loading}
//           >
//             <option value={0}>Выберите обязанность</option>
//             {responsibilities.map((responsibility) => (
//               <option key={responsibility.deputyId} value={responsibility.deputyId}>
//                 {responsibility.deputyName}
//               </option>
//             ))}
//           </select>
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
