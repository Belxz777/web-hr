import { Employee, Job, TFData } from "@/types";

export default function Delete({
  handleEmployeeDelete,
  setEmployeeForDelete,
  employeeForDelete,
  employees,
}: {
  handleEmployeeDelete: (e: React.FormEvent) => void;
  setEmployeeForDelete: (employeeForDelete: any) => void;
  employeeForDelete: any;
  employees: Employee[];
}) {
  return (
    <>
      <section className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-white">
          Удаление сотрудника
        </h2>
        <form className="space-y-4" onSubmit={handleEmployeeDelete}>
          <div>
            <label htmlFor="deleteTitle" className="labelStyles mb-2">
              Сотрудник
            </label>
            <select
              id="deleteTitle"
              required
              value={employeeForDelete.empid}
              onChange={(e) => {
                setEmployeeForDelete({ empid: Number(e.target.value) });
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Выберите сотрудника</option>
              {employees.map((employee: Employee) => (
                <option key={employee.employeeId} value={employee.employeeId}>
                  {employee.firstName} {employee.lastName} (поз.{" "}
                  {employee.position})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition-colors"
          >
            Удалить
          </button>
        </form>
      </section>
    </>
  );
}
