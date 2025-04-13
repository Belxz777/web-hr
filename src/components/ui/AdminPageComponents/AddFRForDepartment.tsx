import { Department, Employee, TFData } from "@/types";

export default function AddFRForDepartment({
  handleFRForDepartmentSubmit,
  setFRFormForDepartment,
  FRFormForDepartment,
  deps,
  responsibilities,
}: {
  handleFRForDepartmentSubmit: (e: React.FormEvent) => void;
  setFRFormForDepartment: (FRFormForDepartment: any) => void;
  FRFormForDepartment: any;
  deps: Department[];
  responsibilities: TFData[];
}) {
  return (
    <>
      <section className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-white">
          Назначение функциональных задач отделу
        </h2>
        <form className="space-y-4" onSubmit={handleFRForDepartmentSubmit}>
          <div>
            <label htmlFor="selectDepartment" className="labelStyles mb-2">
              Выберите отдел
            </label>
            <select
              id="selectDepartment"
              required
              value={FRFormForDepartment.departmentId || ""}
              onChange={(e) => {
                setFRFormForDepartment((prev: {departmentId: number}) => ({
                  ...prev,
                  departmentId: Number(e.target.value),
                }));
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Выберите отдел</option>
              {deps.map((dept) => (
                <option key={dept.departmentId} value={dept.departmentId}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="labelStyles mb-2 block">
              Выберите функциональные обязанности
            </label>
            <div className="max-h-60 overflow-y-auto border border-gray-600 rounded-xl bg-gray-700">
              {responsibilities.map((tf) => (
                <div key={tf.tfId} className="px-4 py-2 hover:bg-gray-600">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={FRFormForDepartment.tfIds.includes(
                        Number(tf.tfId)
                      )}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setFRFormForDepartment((prev: {tfIds: number[]}) => ({
                          ...prev,
                          tfIds: isChecked
                            ? [...prev.tfIds, Number(tf.tfId)]
                            : prev.tfIds.filter((id) => id !== Number(tf.tfId)),
                        }));
                      }}
                      className="form-checkbox h-5 w-5 text-red-500 rounded focus:ring-red-500 bg-gray-700 border-gray-600"
                    />
                    <span
                      className={`text-gray-100 ${
                        tf.isMain ? "text-red-400 font-medium" : ""
                      }`}
                    >
                      {tf.tfName}
                    </span>
                  </label>
                </div>
              ))}
            </div>
            {FRFormForDepartment.tfIds.length > 0 && (
              <div className="mt-2 text-sm text-gray-400">
                Выбрано задач: {FRFormForDepartment.tfIds.length}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-xl transition duration-200"
          >
            Назначить задачи
          </button>
        </form>
      </section>
    </>
  );
}
