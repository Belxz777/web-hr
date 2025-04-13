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
import createTF from "@/components/server/createTF";
import { Employee, TFData } from "@/types";
import allTfByDepartment from "@/components/server/allTfByDepartment";
import useGetAlldeps from "@/hooks/useDeps";
import createTFForDepartment from "@/components/server/createTFForDepartment";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import createTFForPosition from "@/components/server/createTFForPosition";
import updateTF from "@/components/server/updateTF";
import Departments from "@/components/ui/AdminPageComponents/Departments";
import Positions from "@/components/ui/AdminPageComponents/Positions";
import AddFR from "@/components/ui/AdminPageComponents/AddFR";
import AddFRForDepartment from "@/components/ui/AdminPageComponents/AddFRForDepartment";
import AddFRPosition from "@/components/ui/AdminPageComponents/AddFRPosition";
import UpdateFR from "@/components/ui/AdminPageComponents/UpdateFR";
import Delete from "@/components/ui/AdminPageComponents/Delete";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<
    | "departments"
    | "positions"
    | "promotion"
    | "delete"
    | "excel"
    | "downloadingAllReports"
    | "addFR"
    | "addFRForDepartment"
    | "addFRPosition"
    | "updateFR"
  >("departments");
  const [showNotification, setShowNotification] = useState(false);
  const [isError, setIsError] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [responsibilities, setResponsibilities] = useState<TFData[]>([]);
  const { jobs } = useGetAllJobs();
  const { deps } = useGetAlldeps();

  const [departmentForm, setDepartmentForm] = useState({
    name: "",
    description: "",
    headId: "",
  });

  const [positionForm, setPositionForm] = useState({
    title: "",
    description: "",
  });
  const [FRForm, setFRForm] = useState({
    tfName: "",
    tfDescription: "",
    time: 0,
    isMain: false,
  });
  const [FRFormForDepartment, setFRFormForDepartment] = useState<{
    tfIds: number[];
    departmentId: number;
  }>({
    tfIds: [],
    departmentId: 0,
  });

  const [FRFormForPosition, setFRFormForPosition] = useState<{
    tfIds: number[];
    jobId: number;
  }>({
    tfIds: [],
    jobId: 0,
  });
  const [updateFRForm, setUpdateFRForm] = useState({
    tfId: 0,
    tfName: "",
    tfDescription: "",
    time: 0,
    isMain: false,
  });

  const [employeeForDelete, setEmployeeForDelete] = useState({ empid: 0 });

  const [promotionForm, setPromotionForm] = useState({
    empid: "",
    position: "",
    level: 1,
  });

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await allTfByDepartment("all");
        setResponsibilities(data || []);
      } catch (error) {
        console.error("Failed to fetch responsibilities:", error);
      }
    };
    if (
      activeTab === "addFRPosition" ||
      activeTab === "addFRForDepartment" ||
      activeTab === "updateFR"
    ) {
      fetchData();
    }
  }, [activeTab]);

  const router = useRouter();
  const showSuccessNotification = (
    message: string,
    isError: boolean = false
  ) => {
    setNotificationMessage(message);
    setIsError(isError);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleDepartmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!departmentForm.name) {
      showSuccessNotification("Пожалуйста, заполните имя", true);
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
        showSuccessNotification("Ошибка при создании департамента", true);
        return;
      }

      showSuccessNotification("Департамент успешно создан");
      setDepartmentForm({ name: "", description: "", headId: "" });
    } catch (error) {
      console.error("Ошибка при создании департамента:", error);
      showSuccessNotification(
        "Произошла ошибка при создании департамента",
        true
      );
    }
  };

  const handlePositionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!positionForm.title) {
      showSuccessNotification("Пожалуйста, укажите название должности", true);
      return;
    }

    try {
      const response = await createJob(positionForm.title);

      if (!response) {
        showSuccessNotification("Ошибка при создании должности", true);
        return;
      }
      showSuccessNotification("Должность успешно создана");
      setPositionForm({ title: "", description: "" });
    } catch (error) {
      console.error("Error creating position:", error);
      showSuccessNotification("Произошла ошибка при создании должности", true);
    }
  };

  const handlePromotionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !promotionForm.level) {
      showSuccessNotification(
        "Пожалуйста, заполните все поля для повышения",
        true
      );
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
      showSuccessNotification("Ошибка при повышении сотрудника", true);
    }
  };

  const handleEmployeeDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeForDelete.empid) {
      showSuccessNotification("Пожалуйста, выберите сотрудника", true);
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
      showSuccessNotification("Ошибка при удалении сотрудника", true);
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
    console.log("handleFRSubmit invoked with form data:", FRForm);
    try {
      const res = await createTF(FRForm);
      console.log("Response from createTF:", res);

      if (!res) {
        showSuccessNotification(
          "Произошла ошибка при создании функциональной обязанности",
          true
        );
        console.log("Error: No response received from createTF");
        return;
      }

      showSuccessNotification(
        "Функциональная обязанность была успешно создана"
      );
    } catch (error) {
      console.error("Error creating TF:", error);
      showSuccessNotification(
        "Произошла ошибка при создании функциональной обязанности",
        true
      );
    }
  };

  const handleFRForDepartmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createTFForDepartment({
        ...FRFormForDepartment,
        jobsList: jobs.map((job) => job.jobId),
      });

      if (!res) {
        showSuccessNotification(
          "Произошла ошибка при добавлении функциональной обязанности",
          true
        );
        return;
      }

      showSuccessNotification(
        "Функциональная обязанность была успешно добавлена"
      );
    } catch (error) {
      console.error("Error creating TF:", error);
      showSuccessNotification(
        "Произошла ошибка при добавлении функциональной обязанности",
        true
      );
    }
  };

  const handleFRForJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createTFForPosition(FRFormForPosition);

      if (!res) {
        showSuccessNotification(
          "Произошла ошибка при добавлении функциональной обязанности",
          true
        );
        return;
      }

      showSuccessNotification(
        "Функциональная обязанность была успешно добавлена"
      );
    } catch (error) {
      console.error("Error creating TF:", error);
      showSuccessNotification(
        "Произошла ошибка при добавлении функциональной обязанности",
        true
      );
    }
  };
  const handleFRUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateTF(updateFRForm);

      if (!res) {
        showSuccessNotification(
          "Произошла ошибка при изменении функциональной обязанности",
          true
        );
        return;
      }

      showSuccessNotification(
        "Функциональная обязанность была успешно измененна"
      );
    } catch (error) {
      console.error("Error creating TF:", error);
      showSuccessNotification(
        "Произошла ошибка при изменении функциональной обязанности",
        true
      );
    }
  };

  return (
    <div className="mainProfileDiv">
      <Header title="Панель администратора" position={5} showPanel={false} />
      <main className="container mx-auto p-4">
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("departments")}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === "departments"
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Управление департаментами
          </button>
          <button
            onClick={() => setActiveTab("positions")}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === "positions"
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Управление должностями
          </button>
          <button
            onClick={() => setActiveTab("promotion")}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === "promotion"
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Повышение сотрудника
          </button>
          <button
            onClick={() => setActiveTab("delete")}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === "delete"
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Удаление сотрудника
          </button>
          <button
            onClick={() => setActiveTab("excel")}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === "excel"
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
          {/* <button
            onClick={() => setActiveTab("downloadingAllReports")}
            className={`px-4 py-2 rounded-xl transition-colors ${activeTab === "downloadingAllReports"
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            Скачивание всех отчетов
          </button> */}
          <button
            onClick={() => setActiveTab("addFR")}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === "addFR"
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Добавление функ. обяз.
          </button>
          <button
            onClick={() => setActiveTab("addFRForDepartment")}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === "addFRForDepartment"
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Назначение функ. обяз. для отдела
          </button>
          <button
            onClick={() => setActiveTab("addFRPosition")}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === "addFRPosition"
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Назначение функ. обяз. для должности
          </button>
          <button
            onClick={() => setActiveTab("updateFR")}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === "updateFR"
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Изменить функ. обяз.
          </button>
        </div>
        <div>
          {activeTab === "departments" && (
            <Departments
              handleDepartmentSubmit={handleDepartmentSubmit}
              setDepartmentForm={setDepartmentForm}
              departmentForm={departmentForm}
              employees={employees}
            />
          )}

          {activeTab === "positions" && (
            <Positions
              handlePositionSubmit={handlePositionSubmit}
              setPositionForm={setPositionForm}
              positionForm={positionForm}
            />
          )}
          {activeTab === "addFR" && (
            <AddFR
              handleFRSubmit={handleFRSubmit}
              FRForm={FRForm}
              setFRForm={setFRForm}
              employees={employees}
            />
          )}
          {activeTab === "addFRForDepartment" && (
            <AddFRForDepartment
              handleFRForDepartmentSubmit={handleFRForDepartmentSubmit}
              setFRFormForDepartment={setFRFormForDepartment}
              FRFormForDepartment={FRFormForDepartment}
              deps={deps}
              responsibilities={responsibilities}
            />
          )}
          {activeTab === "addFRPosition" && (
            <AddFRPosition
              handleFRForJobSubmit={handleFRForJobSubmit}
              setFRFormForPosition={setFRFormForPosition}
              FRFormForPosition={FRFormForPosition}
              jobs={jobs}
              responsibilities={responsibilities}
            />
          )}

          {activeTab === "updateFR" && (
            <UpdateFR
              handleFRUpdate={handleFRUpdate}
              setUpdateFRForm={setUpdateFRForm}
              updateFRForm={updateFRForm}
              responsibilities={responsibilities}
            />
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
                    <option value="">Выберите начальника департамента</option>
                    {Array.isArray(employees) &&
                      employees?.map((employee) => (
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
                        <p className="text-white">
                          {selectedEmployee.position}
                        </p>
                        <p className="text-sm text-gray-400">
                          Уровень: {selectedEmployee.currentLevel || 1}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-2 h-8 rounded ${
                              level <= (selectedEmployee.currentLevel || 1)
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
                          className={`w-8 h-8 rounded ${
                            level <= promotionForm.level
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
            <Delete
              handleEmployeeDelete={handleEmployeeDelete}
              setEmployeeForDelete={setEmployeeForDelete}
              employeeForDelete={employeeForDelete}
              employees={employees}
            />
          )}
        </div>

        {/* {activeTab === "downloadingAllReports" && (
          <section className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-white">
              Скачивание всех отчетов
            </h2>
            <DownloadingAllReports />
          </section>
        )} */}

        {activeTab === "excel" && (
          <section className="bg-gray-800 rounded-lg p-6 mb-6">
            <ReportUpload />
          </section>
        )}

        {showNotification && (
          <div
            className={`fixed bottom-4 right-4 ${
              isError ? "bg-red-500" : "bg-green-500"
            } text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in`}
          >
            {notificationMessage}
          </div>
        )}
      </main>
    </div>
  );
}
