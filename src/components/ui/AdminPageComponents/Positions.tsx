import { Employee } from "@/types";

export default function Positions({
  handlePositionSubmit,
  setPositionForm,
  positionForm,
}: {
  handlePositionSubmit: (e: React.FormEvent) => void;
  setPositionForm: (positionForm: any) => void;
  positionForm: any;
}) {
  return (
    <>
      <section className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-white">
          Создание новой должности
        </h2>
        <form className="space-y-4" onSubmit={handlePositionSubmit}>
          <div>
            <label htmlFor="positionTitle" className="labelStyles mb-2">
              Название должности
            </label>
            <input
              id="positionTitle"
              type="text"
              required
              value={positionForm.title}
              onChange={(e) =>
                setPositionForm((prev: {title: string}) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Введите название должности"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition-colors"
          >
            Создать должность
          </button>
        </form>
      </section>
    </>
  );
}
