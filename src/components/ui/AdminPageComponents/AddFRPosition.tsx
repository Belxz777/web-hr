// import { Job, TFData } from "@/types";

// export default function AddFRPosition({
//   handleFRForJobSubmit,
//   setFRFormForPosition,
//   FRFormForPosition,
//   jobs,
//   responsibilities,
// }: {
//   handleFRForJobSubmit: (e: React.FormEvent) => void;
//   setFRFormForPosition: (FRFormForPosition: any) => void;
//   FRFormForPosition: any;
//   jobs: Job[];
//   responsibilities: TFData[];
// }) {
//   return (
//     <>
//       <section className="bg-gray-800 rounded-lg p-6 mb-6">
//         <h2 className="text-xl font-bold mb-4 text-white">
//           Назначение функциональной обязанности для должности
//         </h2>
//         <form className="space-y-4" onSubmit={handleFRForJobSubmit}>
//           <div>
//             <label htmlFor="selectTF" className="labelStyles mb-2">
//               Выберите должность
//             </label>
//             <select
//               id="selectDepartment"
//               required
//               value={FRFormForPosition.jobId}
//               onChange={(e) => {
//                 setFRFormForPosition((prev: { jobId: number }) => ({
//                   ...prev,
//                   jobId: Number(e.target.value),
//                 }));
//               }}
//               className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
//             >
//               <option value="">Выберите должность</option>
//               {jobs.map((job, index) => (
//                 <option key={index} value={job.jobId}>
//                   {job.jobName}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="labelStyles mb-2 block">
//               Выберите функциональные обязанности
//             </label>
//             <div className="max-h-60 overflow-y-auto border border-gray-600 rounded-xl bg-gray-700">
//               {responsibilities.length > 0 ? (
//                 responsibilities.map((tf) => (
//                   <div key={tf.tfId} className="px-4 py-2 hover:bg-gray-600">
//                     <label className="flex items-center space-x-3 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={FRFormForPosition.tfIds.includes(
//                           Number(tf.tfId)
//                         )}
//                         onChange={(e) => {
//                           const isChecked = e.target.checked;
//                           setFRFormForPosition((prev: { tfIds: number[] }) => ({
//                             ...prev,
//                             tfIds: isChecked
//                               ? [...prev.tfIds, Number(tf.tfId)]
//                               : prev.tfIds.filter(
//                                   (id) => id !== Number(tf.tfId)
//                                 ),
//                           }));
//                         }}
//                         className="form-checkbox h-5 w-5 text-red-500 rounded focus:ring-red-500 bg-gray-700 border-gray-600"
//                       />
//                       <span
//                         className={`text-gray-100 ${
//                           tf.isMain ? "text-red-400 font-medium" : ""
//                         }`}
//                       >
//                         {tf.tfName}
//                       </span>
//                     </label>
//                   </div>
//                 ))
//               ) : (
//                 <div className="px-4 py-2 text-gray-100">Нет задач</div>
//               )}
//             </div>
//             {FRFormForPosition.tfIds.length > 0 && (
//               <div className="mt-2 text-sm text-gray-400">
//                 Выбрано задач: {FRFormForPosition.tfIds.length}
//               </div>
//             )}
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition-colors"
//           >
//             Назначить функциональную обязанность
//           </button>
//         </form>
//       </section>
//     </>
//   );
// }
