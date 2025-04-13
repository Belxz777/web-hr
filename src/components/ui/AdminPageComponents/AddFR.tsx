import { Employee } from "@/types";

export default function AddFR({
  handleFRSubmit,
  setFRForm,
  FRForm,
  employees,
}: {
  handleFRSubmit: (e: React.FormEvent) => void;
  setFRForm: (FRForm: any) => void;
  FRForm: any;
  employees: Employee[];
}) {
  return (
    <>
      <section className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-white">
          Добавление функциональной обязанности
        </h2>
        <form className="space-y-4" onSubmit={handleFRSubmit}>
          <div>
            <label htmlFor="positionTitle" className="labelStyles mb-2">
              Название функциональной обязанности (не более 50 символов)
            </label>
            <input
              id="positionTitle"
              type="text"
              required
              value={FRForm.tfName}
              onChange={(e) =>
                setFRForm((prev: {tfName: string}) => ({
                  ...prev,
                  tfName: e.target.value,
                }))
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Введите название функциональной обязанности"
              maxLength={50}
            />
            <p className="text-gray-500 text-xs my-1">{`символов: ${FRForm.tfName.length}`}</p>
          </div>
          <div>
            <label htmlFor="positionTitle" className="labelStyles mb-2">
              Описание функциональной обязанности
            </label>
            <textarea
              id="positionTitle"
              value={FRForm.tfDescription}
              onChange={(e) =>
                setFRForm((prev: {tfDescription: string}) => ({
                  ...prev,
                  tfDescription: e.target.value,
                }))
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Введите описание функциональной обязанности"
            />
          </div>

          <div>
            <label htmlFor="positionTitle" className="labelStyles mb-2">
              Время выполнения функциональной обязанности (формат: часы.минуты)
            </label>
            <input
              id="positionTitle"
              type="number"
              required
              value={FRForm.time}
              onChange={(e) =>
                setFRForm((prev: {time: number}) => ({
                  ...prev,
                  time: Number(e.target.value),
                }))
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Введите время выполнения функциональной обязанности (формат: часы,минуты)"
            />
          </div>

          <div>
            <label className="labelStyles mb-4">
              Тип: {FRForm.isMain ? "Основная" : "Дополнительная"}
            </label>
            <div className="flex items-center space-x-4">
              {/* <input
                    type="range"
                    min="1"
                    max="5"
                    value={FRForm.type}
                    onChange={(e) =>
                      setFRForm((prev) => ({
                        ...prev,
                        type: Number(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  /> */}
              <div className="flex justify-center items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFRForm((prev: {isMain: boolean}) => ({ ...prev, isMain: !prev.isMain }))
                  }
                  className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
                >
                  {FRForm.isMain ? "Основная" : "Дополнительная"}
                </button>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition-colors"
          >
            Добавить функциональную обязанность
          </button>
        </form>
      </section>
    </>
  );
}
