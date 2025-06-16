"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import UniversalFooter from "@/components/buildIn/UniversalFooter";

type Department = {
  id: number;
  departmentName: string;
  departmentDescription: string;
  jobsList: number[];
  tfs: number[];
};

type Job = {
  id: number;
  jobName: string;
  deputy: number;
};

type Deputy = {
  id: number;
  name: string;
};

type TFS = {
  id: number;
  name: string;
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"departments" | "positions">(
    "departments"
  );
  const [departmentSubTab, setDepartmentSubTab] = useState<
    "create" | "edit" | "delete"
  >("create");
  const [positionSubTab, setPositionSubTab] = useState<"create" | "edit">(
    "create"
  );

  // Состояния для данных
  const [departments, setDepartments] = useState<Department[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [deputies, setDeputies] = useState<Deputy[]>([]);
  const [loading, setLoading] = useState(false);
  const [tfsOptions, setTfsOptions] = useState<TFS[]>([]);

  // Состояния форм
  const [departmentForm, setDepartmentForm] = useState({
    departmentName: "",
    departmentDescription: "",
  });

  const [editDepartmentForm, setEditDepartmentForm] = useState({
    id: 0,
    jobsList: [] as number[],
    tfs: [] as number[],
  });

  const [deleteDepartmentId, setDeleteDepartmentId] = useState(0);

  const [jobForm, setJobForm] = useState({
    jobName: "",
    deputy: 0,
  });

  const [editJobForm, setEditJobForm] = useState({
    id: 0,
    deputy: 0,
  });

  // Функции-пустышки для загрузки данных
  const fetchDepartments = async () => {
    setLoading(true);
    // Имитация запроса
    setTimeout(() => {
      setDepartments([
        {
          id: 1,
          departmentName: "Отдел разработки",
          departmentDescription: "Разработка программного обеспечения",
          jobsList: [1, 2],
          tfs: [1, 2, 3],
        },
        {
          id: 2,
          departmentName: "Отдел маркетинга",
          departmentDescription: "Продвижение и реклама",
          jobsList: [3],
          tfs: [4, 5],
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const fetchJobs = async () => {
    setLoading(true);
    // Имитация запроса
    setTimeout(() => {
      setJobs([
        { id: 1, jobName: "Frontend разработчик", deputy: 1 },
        { id: 2, jobName: "Backend разработчик", deputy: 2 },
        { id: 3, jobName: "Маркетолог", deputy: 3 },
      ]);
      setLoading(false);
    }, 1000);
  };

  const fetchDeputies = async () => {
    // Имитация запроса
    setDeputies([
      { id: 1, name: "Иванов И.И." },
      { id: 2, name: "Петров П.П." },
      { id: 3, name: "Сидоров С.С." },
    ]);

    // Добавить загрузку TFS
    setTfsOptions([
      { id: 1, name: "Функция планирования" },
      { id: 2, name: "Функция контроля" },
      { id: 3, name: "Функция анализа" },
      { id: 4, name: "Функция отчетности" },
      { id: 5, name: "Функция координации" },
    ]);
  };

  // Функции-пустышки для отправки данных
  const createDepartment = async (data: {
    departmentName: string;
    departmentDescription: string;
  }) => {
    setLoading(true);
    console.log("Создание департамента:", data);
    // Имитация запроса
    setTimeout(() => {
      alert("Департамент создан успешно!");
      setDepartmentForm({ departmentName: "", departmentDescription: "" });
      setLoading(false);
    }, 1000);
  };

  const updateDepartment = async (data: {
    id: number;
    jobsList: number[];
    tfs: number[];
  }) => {
    setLoading(true);
    console.log("Обновление департамента:", data);
    // Имитация запроса
    setTimeout(() => {
      alert("Департамент обновлен успешно!");
      setLoading(false);
    }, 1000);
  };

  const deleteDepartment = async (id: number) => {
    setLoading(true);
    console.log("Удаление департамента:", id);
    // Имитация запроса
    setTimeout(() => {
      alert("Департамент удален успешно!");
      setDeleteDepartmentId(0);
      setLoading(false);
    }, 1000);
  };

  const createJob = async (data: { jobName: string; deputy: number }) => {
    setLoading(true);
    console.log("Создание должности:", data);
    // Имитация запроса
    setTimeout(() => {
      alert("Должность создана успешно!");
      setJobForm({ jobName: "", deputy: 0 });
      setLoading(false);
    }, 1000);
  };

  const updateJob = async (data: { id: number; deputy: number }) => {
    setLoading(true);
    console.log("Обновление должности:", data);
    // Имитация запроса
    setTimeout(() => {
      alert("Должность обновлена успешно!");
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (activeTab === "departments" && departments.length === 0) {
      fetchDepartments();
      fetchDeputies();
    } else if (activeTab === "positions" && jobs.length === 0) {
      fetchJobs();
      fetchDeputies();
    }
  }, [activeTab]);

  const TabButton = ({
    tab,
    label,
    isActive,
  }: {
    tab: string;
    label: string;
    isActive: boolean;
  }) => (
    <button
      onClick={() => setActiveTab(tab as any)}
      className={`px-6 py-3 font-medium rounded-t-xl transition-all duration-200 ${
        isActive
          ? "bg-white text-[#249BA2] border-b-2 border-[#249BA2]"
          : "bg-gray-100 text-[#6D6D6D] hover:bg-gray-200 hover:text-[#000000]"
      }`}
    >
      {label}
    </button>
  );

  const SubTabButton = ({
    tab,
    label,
    isActive,
    onClick,
  }: {
    tab: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-[#249BA2] text-white"
          : "bg-gray-100 text-[#6D6D6D] hover:bg-gray-200 hover:text-[#000000]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="Админ-панель" showPanel={true} position={5} />

      <main className="container mx-auto p-4 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#000000] mb-6">
            Управление системой
          </h1>

          <div className="flex space-x-1 mb-6">
            <TabButton
              tab="departments"
              label="Департаменты"
              isActive={activeTab === "departments"}
            />
            <TabButton
              tab="positions"
              label="Должности"
              isActive={activeTab === "positions"}
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            {activeTab === "departments" && (
              <div>
                <h2 className="text-2xl font-bold text-[#000000] mb-4">
                  Управление департаментами
                </h2>

                <div className="flex space-x-2 mb-6">
                  <SubTabButton
                    tab="create"
                    label="Создание отдела"
                    isActive={departmentSubTab === "create"}
                    onClick={() => setDepartmentSubTab("create")}
                  />
                  <SubTabButton
                    tab="edit"
                    label="Изменение отдела"
                    isActive={departmentSubTab === "edit"}
                    onClick={() => setDepartmentSubTab("edit")}
                  />
                  <SubTabButton
                    tab="delete"
                    label="Удаление отдела"
                    isActive={departmentSubTab === "delete"}
                    onClick={() => setDepartmentSubTab("delete")}
                  />
                </div>

                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#249BA2]"></div>
                    <span className="ml-2 text-[#6D6D6D]">Загрузка...</span>
                  </div>
                )}

                {departmentSubTab === "create" && !loading && (
                  <div className="max-w-md">
                    <h3 className="text-lg font-semibold text-[#000000] mb-4">
                      Создать новый отдел
                    </h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        createDepartment(departmentForm);
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[#6D6D6D] mb-1">
                          Название отдела
                        </label>
                        <input
                          type="text"
                          required
                          value={departmentForm.departmentName}
                          onChange={(e) =>
                            setDepartmentForm({
                              ...departmentForm,
                              departmentName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#249BA2]"
                          placeholder="Введите название отдела"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6D6D6D] mb-1">
                          Описание отдела
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={departmentForm.departmentDescription}
                          onChange={(e) =>
                            setDepartmentForm({
                              ...departmentForm,
                              departmentDescription: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#249BA2]"
                          placeholder="Введите описание отдела"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 bg-[#249BA2] text-white rounded-xl hover:bg-[#1e8a90] transition-colors disabled:opacity-50"
                      >
                        {loading ? "Создание..." : "Создать отдел"}
                      </button>
                    </form>
                  </div>
                )}

                {departmentSubTab === "edit" && !loading && (
                  <div className="max-w-lg">
                    <h3 className="text-lg font-semibold text-[#000000] mb-4">
                      Изменить информацию об отделе
                    </h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        updateDepartment(editDepartmentForm);
                      }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[#6D6D6D] mb-1">
                          Выберите отдел
                        </label>
                        <select
                          required
                          value={editDepartmentForm.id}
                          onChange={(e) =>
                            setEditDepartmentForm({
                              ...editDepartmentForm,
                              id: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#249BA2]"
                        >
                          <option value={0}>Выберите отдел</option>
                          {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.departmentName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#6D6D6D] mb-2">
                          Должности (Jobs List)
                        </label>
                        <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-3">
                          {jobs.map((job) => (
                            <label
                              key={job.id}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={editDepartmentForm.jobsList.includes(
                                  job.id
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditDepartmentForm({
                                      ...editDepartmentForm,
                                      jobsList: [
                                        ...editDepartmentForm.jobsList,
                                        job.id,
                                      ],
                                    });
                                  } else {
                                    setEditDepartmentForm({
                                      ...editDepartmentForm,
                                      jobsList:
                                        editDepartmentForm.jobsList.filter(
                                          (id) => id !== job.id
                                        ),
                                    });
                                  }
                                }}
                                className="rounded border-gray-300 text-[#249BA2] focus:ring-[#249BA2]"
                              />
                              <span className="text-sm text-[#000000]">
                                {job.jobName}
                              </span>
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-[#6D6D6D] mt-1">
                          Выбрано: {editDepartmentForm.jobsList.length}{" "}
                          должностей
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#6D6D6D] mb-2">
                          Функции (TFS)
                        </label>
                        <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-3">
                          {tfsOptions.map((tfs) => (
                            <label
                              key={tfs.id}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={editDepartmentForm.tfs.includes(
                                  tfs.id
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditDepartmentForm({
                                      ...editDepartmentForm,
                                      tfs: [...editDepartmentForm.tfs, tfs.id],
                                    });
                                  } else {
                                    setEditDepartmentForm({
                                      ...editDepartmentForm,
                                      tfs: editDepartmentForm.tfs.filter(
                                        (id) => id !== tfs.id
                                      ),
                                    });
                                  }
                                }}
                                className="rounded border-gray-300 text-[#249BA2] focus:ring-[#249BA2]"
                              />
                              <span className="text-sm text-[#000000]">
                                {tfs.name}
                              </span>
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-[#6D6D6D] mt-1">
                          Выбрано: {editDepartmentForm.tfs.length} функций
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || editDepartmentForm.id === 0}
                        className="w-full px-4 py-2 bg-[#249BA2] text-white rounded-xl hover:bg-[#1e8a90] transition-colors disabled:opacity-50"
                      >
                        {loading ? "Обновление..." : "Обновить отдел"}
                      </button>
                    </form>
                  </div>
                )}

                {departmentSubTab === "delete" && !loading && (
                  <div className="max-w-md">
                    <h3 className="text-lg font-semibold text-[#000000] mb-4">
                      Удалить отдел
                    </h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (
                          confirm("Вы уверены, что хотите удалить этот отдел?")
                        ) {
                          deleteDepartment(deleteDepartmentId);
                        }
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[#6D6D6D] mb-1">
                          Выберите отдел для удаления
                        </label>
                        <select
                          required
                          value={deleteDepartmentId}
                          onChange={(e) =>
                            setDeleteDepartmentId(Number(e.target.value))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#249BA2]"
                        >
                          <option value={0}>Выберите отдел</option>
                          {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.departmentName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={loading || deleteDepartmentId === 0}
                        className="w-full px-4 py-2 bg-[#FF0000] text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? "Удаление..." : "Удалить отдел"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {activeTab === "positions" && (
              <div>
                <h2 className="text-2xl font-bold text-[#000000] mb-4">
                  Управление должностями
                </h2>

                <div className="flex space-x-2 mb-6">
                  <SubTabButton
                    tab="create"
                    label="Добавление работы"
                    isActive={positionSubTab === "create"}
                    onClick={() => setPositionSubTab("create")}
                  />
                  <SubTabButton
                    tab="edit"
                    label="Изменение работы"
                    isActive={positionSubTab === "edit"}
                    onClick={() => setPositionSubTab("edit")}
                  />
                </div>

                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#249BA2]"></div>
                    <span className="ml-2 text-[#6D6D6D]">Загрузка...</span>
                  </div>
                )}

                {positionSubTab === "create" && !loading && (
                  <div className="max-w-md">
                    <h3 className="text-lg font-semibold text-[#000000] mb-4">
                      Добавить новую работу
                    </h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        createJob(jobForm);
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[#6D6D6D] mb-1">
                          Название работы
                        </label>
                        <input
                          type="text"
                          required
                          value={jobForm.jobName}
                          onChange={(e) =>
                            setJobForm({ ...jobForm, jobName: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#249BA2]"
                          placeholder="Введите название работы"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6D6D6D] mb-1">
                          Deputy (ID)
                        </label>
                        <select
                          required
                          value={jobForm.deputy}
                          onChange={(e) =>
                            setJobForm({
                              ...jobForm,
                              deputy: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#249BA2]"
                        >
                          <option value={0}>Выберите deputy</option>
                          {deputies.map((deputy) => (
                            <option key={deputy.id} value={deputy.id}>
                              {deputy.name} (ID: {deputy.id})
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 bg-[#249BA2] text-white rounded-xl hover:bg-[#1e8a90] transition-colors disabled:opacity-50"
                      >
                        {loading ? "Создание..." : "Создать работу"}
                      </button>
                    </form>
                  </div>
                )}

                {positionSubTab === "edit" && !loading && (
                  <div className="max-w-md">
                    <h3 className="text-lg font-semibold text-[#000000] mb-4">
                      Изменить работу
                    </h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        updateJob(editJobForm);
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[#6D6D6D] mb-1">
                          Выберите работу
                        </label>
                        <select
                          required
                          value={editJobForm.id}
                          onChange={(e) =>
                            setEditJobForm({
                              ...editJobForm,
                              id: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#249BA2]"
                        >
                          <option value={0}>Выберите работу</option>
                          {jobs.map((job) => (
                            <option key={job.id} value={job.id}>
                              {job.jobName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6D6D6D] mb-1">
                          Deputy (ID)
                        </label>
                        <select
                          required
                          value={editJobForm.deputy}
                          onChange={(e) =>
                            setEditJobForm({
                              ...editJobForm,
                              deputy: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#249BA2]"
                        >
                          <option value={0}>Выберите deputy</option>
                          {deputies.map((deputy) => (
                            <option key={deputy.id} value={deputy.id}>
                              {deputy.name} (ID: {deputy.id})
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={loading || editJobForm.id === 0}
                        className="w-full px-4 py-2 bg-[#249BA2] text-white rounded-xl hover:bg-[#1e8a90] transition-colors disabled:opacity-50"
                      >
                        {loading ? "Обновление..." : "Обновить работу"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <UniversalFooter />
    </div>
  );
}
