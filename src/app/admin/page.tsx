"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { ReportUpload } from "@/components/buildIn/ReportUpload";
import { createJob } from "@/components/server/jobs";
import createDepartment from "@/components/server/createDepartment";
import getEmployees from "@/components/server/emps_get";
import promotion from "@/components/server/promotion";
import { deleteUser } from "@/components/server/userdata";
import { useRouter } from "next/navigation";
import { DownloadingAllReports } from "@/components/buildIn/DownloadingAllReports";
import createTF from "@/components/server/createTF";

// Types
type Employee = {
  employeeId: number;
  firstName: string;
  lastName: string;
  position: string;
  currentLevel?: number;
};

// type Position = {
//   id: number;
//   title: string;
//   description: string;
// };

// const positions: Position[] = [
//   {
//     id: 1,
//     title: "Младший разработчик",
//     description: "Начальная позиция разработчика",
//   },
//   { id: 2, title: "Разработчик", description: "Основная позиция разработчика" },
//   {
//     id: 3,
//     title: "Старший разработчик",
//     description: "Ведущая позиция разработчика",
//   },
//   { id: 4, title: "Дизайнер", description: "Позиция дизайнера" },
//   { id: 5, title: "Менеджер", description: "Управляющая позиция" },
// ];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<
    | "departments"
    | "positions"
    | "promotion"
    | "delete"
    | "excel"
    | "downloadingAllReports"
    | "addFR"
  >("departments");
  const [showNotification, setShowNotification] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showError, setShowError] = useState(false);
  // Department form state
  const [departmentForm, setDepartmentForm] = useState({
    name: "",
    description: "",
    headId: "",
  });

  // Position form state
  const [positionForm, setPositionForm] = useState({
    title: "",
    description: "",
  });
  const [FRForm, setFRForm] = useState({
    typicalFunctionName: "",
    typicalFunctionDescription: "",
    time: 0,
    isMain: false
  });
  
  const [employeeForDelete, setEmployeeForDelete] = useState({ empid: 0 });

  // Promotion form state
  const [promotionForm, setPromotionForm] = useState({
    empid: "",
    position: "",
    level: 1,
  });

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  // useEffect(() => {
  //   const checkAdmin = async () => {
  //     await new Promise((resolve) => setTimeout(resolve, 2000));
  //     setIsLoading(false);
  //   };
  //   checkAdmin();
  // }, []);

  useEffect(() => {
    const getEmps = async () => {
      const emps = await getEmployees();
      if (emps) {
        setEmployees(emps);
      }
    };

    if (activeTab === "promotion" || activeTab === "departments") {
      getEmps();
    }
  }, [activeTab]);

  // const handleAdminAuth = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   await new Promise((resolve) => setTimeout(resolve, 1000));

  //   if (adminPassword === "123") {
  //     setIsAdmin(true);
  //     showSuccessNotification("Доступ предоставлен");
  //   } else {
  //     setShowError(true);
  //     setTimeout(() => setShowError(false), 3000);
  //   }

  //   setIsLoading(false);
  //   setAdminPassword("");
  // };
  const router = useRouter();
  const showSuccessNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleDepartmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!departmentForm.name) {
      showSuccessNotification("Пожалуйста, заполните имя");
      return;
    }

    const formattedData = {
      departmentName: departmentForm.name,
      ...(departmentForm.description && {
        departmentDescription: departmentForm.description,
      }),
      ...(departmentForm.headId &&
        Number(departmentForm.headId) > 0 && {
        headId: Number(departmentForm.headId),
      }),
    };

    try {
      const response = await createDepartment(formattedData);

      if (!response) {
        showSuccessNotification("Ошибка при создании департамента");
        return;
      }

      showSuccessNotification("Департамент успешно создан");
      setDepartmentForm({ name: "", description: "", headId: "" });
    } catch (error) {
      console.error("Ошибка при создании департамента:", error);
      showSuccessNotification("Произошла ошибка при создании департамента");
    }
  };

  const handlePositionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!positionForm.title) {
      showSuccessNotification("Пожалуйста, укажите название должности");
      return;
    }

    try {
      const response = await createJob(positionForm.title);

      if (!response) {
        showSuccessNotification("Ошибка при создании должности");
        return;
      }
      showSuccessNotification("Должность успешно создана");
      setPositionForm({ title: "", description: "" });
    } catch (error) {
      console.error("Error creating position:", error);
      showSuccessNotification("Произошла ошибка при создании должности");
    }
  };

  const handlePromotionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !promotionForm.level) {
      showSuccessNotification("Пожалуйста, заполните все поля для повышения");
      return;
    }

    try {
      const response = await promotion({
        empid: selectedEmployee.employeeId,
        position: Number(promotionForm.level),
      });

      if (response) {
        showSuccessNotification("Сотрудник успешно повышен");
        setPromotionForm({ empid: "", position: "", level: 1 });
        setSelectedEmployee(null);
      }
    } catch (error) {
      console.error("Error promoting employee:", error);
      showSuccessNotification("Ошибка при повышении сотрудника");
    }
  };

  const handleEmployeeDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeForDelete.empid) {
      showSuccessNotification("Пожалуйста, выберите сотрудника");
      return;
    }

    try {
      const response = await deleteUser(employeeForDelete.empid);
      if (response) {
        showSuccessNotification("Сотрудник успешно удален");
        setEmployeeForDelete({ empid: 0 });
      }
    } catch (error) {
      console.error("Error promoting employee:", error);
      showSuccessNotification("Удален");
    }
  };

  const handleEmployeeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const employeeId = e.target.value;
    const employee = employees.find(
      (emp) => emp.employeeId === Number(employeeId)
    );
    if (employee) {
      setSelectedEmployee(employee);
      setPromotionForm((prev) => ({ ...prev, empid: employeeId }));
    }
  };
  const handleFRSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
try {
  const res = await createTF(FRForm);

  if (!res) {
    showSuccessNotification("Произошла ошибка при создании функциональной обязанности");
    return;
  }

  showSuccessNotification("Функциональная обязанность была успешно создана");
  
} catch (error) {
  console.error("Error creating TF:", error);
  showSuccessNotification("Произошла ошибка при создании функциональной обязанности");
}

  };

  return (
    <div className="mainProfileDiv">
      <Header title="Панель администратора" position={5} showPanel={false} />
      <main className="container mx-auto p-4">
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("departments")}
            className={`px-4 py-2 rounded-xl transition-colors ${activeTab === "departments"
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            Управление департаментами
          </button>
          <button
            onClick={() => setActiveTab("positions")}
            className={`px-4 py-2 rounded-xl transition-colors ${activeTab === "positions"
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            Управление должностями
          </button>
          <button
            onClick={() => setActiveTab("promotion")}
            className={`px-4 py-2 rounded-xl transition-colors ${activeTab === "promotion"
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            Повышение сотрудника
          </button>
          <button
            onClick={() => setActiveTab("delete")}
            className={`px-4 py-2 rounded-xl transition-colors ${activeTab === "delete"
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            Удаление сотрудника
          </button>
          <button
            onClick={() => setActiveTab("excel")}
            className={`px-4 py-2 rounded-xl transition-colors ${activeTab === "excel"
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            Загрузка Excel файла с задачами
          </button>
          <button
            onClick={() => router.push("/stats")}
            className={`px-4 py-2 rounded-xl transition-colors bg-gray-700 text-gray-300 hover:bg-gray-600`}
          >
            Работоспособность бекенда{" "}
          </button>
          <button
            onClick={() => router.push("/admin/users")}
            className={`px-4 py-2 rounded-xl transition-colors bg-gray-700 text-gray-300 hover:bg-gray-600`}
          >
            Поиск пользователя{" "}
          </button>
          <button
            onClick={() => setActiveTab("downloadingAllReports")}
            className={`px-4 py-2 rounded-xl transition-colors ${activeTab === "downloadingAllReports"
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            Скачивание всех отчетов
          </button>
          <button
            onClick={() => setActiveTab("addFR")}
            className={`px-4 py-2 rounded-xl transition-colors ${activeTab === "addFR"
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            Добавление функциональной обязанности
          </button>
        </div>

        {activeTab === "departments" && (
          <section className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-white">
              Создание нового департамента
            </h2>
            <form onSubmit={handleDepartmentSubmit} className="space-y-4">
              <div>
                <label htmlFor="departmentName" className="labelStyles mb-2">
                  Название департамента
                </label>
                <input
                  id="departmentName"
                  type="text"
                  required
                  value={departmentForm.name}
                  onChange={(e) =>
                    setDepartmentForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Введите название департамента"
                />
              </div>
              <div>
                <label
                  htmlFor="departmentDescription"
                  className="labelStyles mb-2"
                >
                  Описание департамента
                </label>
                <textarea
                  id="departmentDescription"
                  required
                  value={departmentForm.description}
                  onChange={(e) =>
                    setDepartmentForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={4}
                  placeholder="Введите описание департамента"
                />
              </div>
              <div>
                <label htmlFor="departmentHead" className="labelStyles mb-2">
                  Начальник департамента
                </label>
                <select
                  id="departmentHead"
                  value={departmentForm.headId}
                  onChange={(e) =>
                    setDepartmentForm((prev) => ({
                      ...prev,
                      headId: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Выберите начальника департамента</option>
                  {employees.map((employee) => (
                    <option
                      key={employee.employeeId}
                      value={employee.employeeId}
                    >
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
                Создать департамент
              </button>
            </form>
          </section>
        )}

        {activeTab === "positions" && (
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
                    setPositionForm((prev) => ({
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
        )}
        {activeTab === "addFR" && (
          <section className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-white">
              Добавление функциональной обязанности
            </h2>
            <form className="space-y-4" onSubmit={handleFRSubmit}>
              <div>
                <label htmlFor="positionTitle" className="labelStyles mb-2">
                  Название функциональной обязанности
                </label>
                <input
                  id="positionTitle"
                  type="text"
                  required
                  value={FRForm.typicalFunctionName}
                  onChange={(e) =>
                    setFRForm((prev) => ({
                      ...prev,
                      typicalFunctionName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Введите название функциональной обязанности"
                />
              </div>
              <div>
                <label htmlFor="positionTitle" className="labelStyles mb-2">
                  Описание функциональной обязанности
                </label>
                <textarea
                  id="positionTitle"
                  required
                  value={FRForm.typicalFunctionDescription}
                  onChange={(e) =>
                    setFRForm((prev) => ({
                      ...prev,
                      typicalFunctionDescription: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Введите описание функциональной обязанности"
                />
              </div>

              <div>
                <label htmlFor="positionTitle" className="labelStyles mb-2">
                  Врямя выполнения функциональной обязанности (формат: часы:минуты)
                </label>
                <input
                  id="positionTitle"
                  type="number"
                  required
                  value={FRForm.time}
                  onChange={(e) =>
                    setFRForm((prev) => ({
                      ...prev,
                      time: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Введите время выполнения функциональной обязанности (формат: часы:минуты)"
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
                      onClick={() => setFRForm((prev) => ({ ...prev, isMain: !prev.isMain }))}
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
        )}

        {activeTab === "promotion" && (
          <section className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-white">
              Повышение сотрудника
            </h2>
            <form onSubmit={handlePromotionSubmit} className="space-y-6">
              <div>
                <label htmlFor="employee" className="labelStyles mb-2">
                  Выберите сотрудника
                </label>
                <select
                  id="employee"
                  required
                  value={promotionForm.empid}
                  onChange={handleEmployeeSelect}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Выберите сотрудника</option>
                  {employees.map((employee) => (
                    <option
                      key={employee.employeeId}
                      value={employee.employeeId}
                    >
                      {employee.firstName} {employee.lastName} (поз.{" "}
                      {employee.position})
                    </option>
                  ))}
                </select>
              </div>

              {selectedEmployee && (
                <div className="bg-gray-700 p-4 rounded-xl">
                  <h3 className="font-medium text-gray-300 mb-2">
                    Текущая позиция
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">{selectedEmployee.position}</p>
                      <p className="text-sm text-gray-400">
                        Уровень: {selectedEmployee.currentLevel || 1}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-2 h-8 rounded ${level <= (selectedEmployee.currentLevel || 1)
                            ? "bg-red-500"
                            : "bg-gray-600"
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* <div>
                <label htmlFor="newPosition" className="labelStyles mb-2">
                  Новая должность
                </label>
                <select
                  id="newPosition"
                  required
                  value={promotionForm.position}
                  onChange={(e) =>
                    setPromotionForm((prev) => ({
                      ...prev,
                      position: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Выберите новую должность</option>
                  {positions.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.title}
                    </option>
                  ))}
                </select>
              </div> */}

              <div>
                <label className="labelStyles mb-4">
                  Новый уровень: {promotionForm.level}
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={promotionForm.level}
                    onChange={(e) =>
                      setPromotionForm((prev) => ({
                        ...prev,
                        level: Number(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() =>
                          setPromotionForm((prev) => ({ ...prev, level }))
                        }
                        className={`w-8 h-8 rounded ${level <= promotionForm.level
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-gray-600 hover:bg-gray-500"
                          } transition-colors`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition-colors"
              >
                Повысить сотрудника
              </button>
            </form>
          </section>
        )}

        {activeTab === "delete" && (
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
                  {employees.map((employee) => (
                    <option
                      key={employee.employeeId}
                      value={employee.employeeId}
                    >
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
        )}

        {activeTab === "downloadingAllReports" && (
          <section className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-white">
              Скачивание всех отчетов
            </h2>
            <DownloadingAllReports />
          </section>
        )}

        {activeTab === "excel" && (
          <section className="bg-gray-800 rounded-lg p-6 mb-6">
            <ReportUpload />
          </section>
        )}

        {showNotification && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in">
            {notificationMessage}
          </div>
        )}
      </main>
    </div>
  );
}
