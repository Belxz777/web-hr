// Could be useful

// import { Job, TFData } from "@/types";

// export default function UpdateFR({
//   handleFRUpdate,
//   setUpdateFRForm,
//   updateFRForm,
//   responsibilities,
// }: {
//   handleFRUpdate: (e: React.FormEvent) => void;
//   setUpdateFRForm: (updateFRForm: any) => void;
//   updateFRForm: any;
//   responsibilities: TFData[];
// }) {
//   return (
//     <>
//       <section className="bg-gray-800 rounded-lg p-6 mb-6">
//         <h2 className="text-xl font-bold mb-4 text-white">
//           Изменение функциональной обязанности
//         </h2>
//         <form className="space-y-4" onSubmit={handleFRUpdate}>
//           <div>
//             <label htmlFor="selectTF" className="labelStyles mb-2">
//               Выберите функциональную обязанность
//             </label>
//             <select
//               id="selectTF"
//               required
//               value={updateFRForm.tfId}
//               onChange={(e) => {
//                 const selectedTfId = Number(e.target.value);
//                 const selectedTf = responsibilities.find(
//                   (tf) => Number(tf.tfId) === Number(selectedTfId)
//                 );

//                 setUpdateFRForm({
//                   tfId: selectedTfId,
//                   tfName: selectedTf ? selectedTf.tfName : "",
//                   tfDescription: selectedTf ? selectedTf.tfDescription : "",
//                   time: selectedTf ? selectedTf.time : 0,
//                   isMain: selectedTf ? selectedTf.isMain : false,
//                 });
//               }}
//               className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
//             >
//               <option value="">Выберите функциональную обязанность</option>
//               {responsibilities.map((tf) => (
//                 <option
//                   key={tf.tfId}
//                   value={tf.tfId}
//                   className={`${tf.isMain ? "text-red-400" : ""}`}
//                 >
//                   {tf.tfName}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label htmlFor="positionTitle" className="labelStyles mb-2">
//               Изменение названия функциональной обязанности (до 50 символов)
//             </label>
//             <input
//               id="positionTitle"
//               type="text"
//               required
//               value={updateFRForm.tfName}
//               onChange={(e) =>
//                 setUpdateFRForm((prev: {tfName: string}) => ({
//                   ...prev,
//                   tfName: e.target.value,
//                 }))
//               }
//               className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
//               placeholder="Введите название функциональной обязанности"
//               maxLength={50}
//             />
//             <p className="text-gray-500 text-xs my-1">{`символов: ${updateFRForm.tfName.length}`}</p>
//           </div>
//           <div>
//             <label htmlFor="positionTitle" className="labelStyles mb-2">
//               Описание функциональной обязанности
//             </label>
//             <textarea
//               id="positionTitle"
//               value={updateFRForm.tfDescription}
//               onChange={(e) =>
//                 setUpdateFRForm((prev: {tfDescription: string}) => ({
//                   ...prev,
//                   tfDescription: e.target.value,
//                 }))
//               }
//               className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
//               placeholder="Введите описание функциональной обязанности"
//             />
//           </div>

//           <div>
//             <label htmlFor="positionTitle" className="labelStyles mb-2">
//               Врямя выполнения функциональной обязанности (формат: часы,минуты)
//             </label>
//             <input
//               id="positionTitle"
//               type="number"
//               required
//               value={updateFRForm.time}
//               onChange={(e) =>
//                 setUpdateFRForm((prev: {time: number}) => ({
//                   ...prev,
//                   time: Number(e.target.value),
//                 }))
//               }
//               className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
//               placeholder="Введите время выполнения функциональной обязанности (формат: часы,минуты)"
//             />
//           </div>

//           <div>
//             <label className="labelStyles mb-4">
//               Тип: {updateFRForm.isMain ? "Основная" : "Дополнительная"}
//             </label>
//             <div className="flex items-center space-x-4">
//               <div className="flex justify-center items-center gap-3">
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setUpdateFRForm((prev: {isMain: boolean}) => ({
//                       ...prev,
//                       isMain: !prev.isMain,
//                     }))
//                   }
//                   className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
//                 >
//                   {updateFRForm.isMain ? "Основная" : "Дополнительная"}
//                 </button>
//               </div>
//             </div>
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition-colors"
//           >
//             Изменить функциональную обязанность
//           </button>
//         </form>
//       </section>
//     </>
//   );
// }
