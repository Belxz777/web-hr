"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import UniversalFooter from "@/components/buildIn/UniversalFooter";
import {
  createDepartmentFn,
  deleteDepartmentFn,
  updateDepartmentFn,
} from "@/components/server/admin/department";
import useGetAlldeps from "@/hooks/useDeps";
import { getAllDeputies, createDeputyFn, updateDeputyFn, deleteDeputyFn } from "@/components/server/admin/deputy";
import { createJobFn, deleteJobFn, getAllJobs, updateJobFn } from "@/components/server/admin/jobs";
import { createFunctionFn, deleteFunctionFn, getAllFunctionsForReport } from "@/components/server/userdata/functions";

type Department = {
  departmentId: number;
  departmentName: string;
};

type Job = {
  jobId: number;
  jobName: string;
  deputy: number;
};

type Deputy = {
  deputyId: number;
  deputyName: string;
  deputyDescription: string | null;
  compulsory: boolean;
  deputy_functions: { funcId: number; funcName: string }[];
};

type TFS = {
  funcId: number;
  funcName: string;
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"departments" | "positions" | "functions" | "deputies">("departments");
  const [departmentSubTab, setDepartmentSubTab] = useState<"create" | "edit" | "delete">("create");
  const [positionSubTab, setPositionSubTab] = useState<"create" | "edit" | "delete">("create");
  const [functionSubTab, setFunctionSubTab] = useState<"create" | "delete">("create");
  const [deputySubTab, setDeputySubTab] = useState<"create" | "edit" | "delete">("create");

  const [departments, setDepartments] = useState<Department[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [deputies, setDeputies] = useState<Deputy[]>([]);
  const [tfsOptions, setTfsOptions] = useState<TFS[]>([]);
  const [loading, setLoading] = useState(false);

  const { deps, loading: isDepsLoading, refetch } = useGetAlldeps();

  useEffect(() => {
    setLoading(isDepsLoading);
    if (deps) {
      setDepartments(deps);
    }
  }, [deps, isDepsLoading]);

  const [isJobsLoaded, setIsJobsLoaded] = useState(false);
  const [isDeputiesLoaded, setIsDeputiesLoaded] = useState(false);
  const [isTfsLoaded, setIsTfsLoaded] = useState(false);

  const fetchJobs = async () => {
    if (isJobsLoaded) return;
    setLoading(true);
    try {
      const jobsData = await getAllJobs();
      setJobs(jobsData);
      setIsJobsLoaded(true);
    } catch (error) {
      console.error("Ошибка загрузки должностей:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeputies = async () => {
    if (isDeputiesLoaded) return;
    setLoading(true);
    try {
      const deputiesData = await getAllDeputies();
      if (deputiesData) {
        setDeputies(deputiesData);
        setIsDeputiesLoaded(true);
      }
    } catch (error) {
      console.error("Ошибка загрузки замов:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTFS = async () => {
    if (isTfsLoaded) return;
    setLoading(true);
    try {
      const tfsData = await getAllFunctionsForReport();
      if (tfsData) {
        setTfsOptions(tfsData.functions);
        setIsTfsLoaded(true);
      }
    } catch (error) {
      console.error("Ошибка загрузки TFS:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "departments") {
      if (departmentSubTab === "edit") {
        if (!isJobsLoaded) fetchJobs();
        if (!isDeputiesLoaded) fetchDeputies();
        if (!isTfsLoaded) fetchTFS();
      } else if (departmentSubTab === "delete" && !isDepsLoading) {
        refetch();
      }
    } else if (activeTab === "positions") {
      if (positionSubTab === "create" || positionSubTab === "edit") {
        if (!isJobsLoaded) fetchJobs();
        if (!isDeputiesLoaded) fetchDeputies();
      }
    } else if (activeTab === "functions") {
      if (!isDeputiesLoaded) fetchDeputies();
      if (functionSubTab === "delete" && !isTfsLoaded) fetchTFS();
    } else if (activeTab === "deputies") {
      if (!isDeputiesLoaded) fetchDeputies();
      if (deputySubTab === "edit" && !isTfsLoaded) fetchTFS();
    }
  }, [activeTab, departmentSubTab, positionSubTab, functionSubTab, deputySubTab, isJobsLoaded, isDeputiesLoaded, isTfsLoaded]);

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

  const [deleteJobForm, setDeleteJobForm] = useState({
    id: 0,
  });

  const [createFunctionForm, setCreateFunctionForm] = useState({
    funcName: "",
    consistent: 0,
  });

  const [deleteFunctionId, setDeleteFunctionId] = useState(0);

  const [createDeputyForm, setCreateDeputyForm] = useState({
    deputyName: "",
  });

  const [editDeputyForm, setEditDeputyForm] = useState({
    id: 0,
    deputy_functions: [] as number[],
  });

  const [deleteDeputyId, setDeleteDeputyId] = useState(0);

  const createDepartment = async (data: {
    departmentName: string;
    departmentDescription: string;
  }) => {
    setLoading(true);
    try {
      await createDepartmentFn(data);
      await refetch();
      alert("Отдел создан успешно!");
    } catch (error) {
      console.error("Ошибка создания отдела:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateDepartment = async (data: {
    id: number;
    jobsList: number[];
    tfs: number[];
  }) => {
    setLoading(true);
    try {
      await updateDepartmentFn(data.id, data.jobsList, data.tfs);
      await refetch();
      alert("Департамент обновлен успешно!");
    } catch (error) {
      console.error("Ошибка обновления отдела:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id: number) => {
    setLoading(true);
    try {
      await deleteDepartmentFn(id);
      await refetch();
    } catch (error) {
      console.error("Ошибка удаления отдела:", error);
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (data: { jobName: string; deputy: number }) => {
    setLoading(true);
    try {
      await createJobFn(data.jobName, data.deputy);
      setIsJobsLoaded(false);
      await fetchJobs();
      alert("Должность создана успешно!");
      setJobForm({ jobName: "", deputy: 0 });
    } catch (error) {
      console.error("Ошибка создания должности:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateJob = async (data: { id: number; deputy: number }) => {
    setLoading(true);
    try {
      await updateJobFn(data.id, data.deputy);
      setIsJobsLoaded(false);
      await fetchJobs();
      alert("Должность обновлена успешно!");
    } catch (error) {
      console.error("Ошибка обновления должности:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (data: { id: number }) => {
    setLoading(true);
    try {
      await deleteJobFn(data.id);
      setIsJobsLoaded(false);
      await fetchJobs();
      alert("Должность удалена успешно!");
    } catch (error) {
      console.error("Ошибка удаления должности:", error);
    } finally {
      setLoading(false);
    }
  };

  const createFunction = async (data: { funcName: string; consistent: number }) => {
    setLoading(true);
    try {
      await createFunctionFn(data);
      setIsTfsLoaded(false);
      await fetchTFS();
      alert("Функция создана успешно!");
      setCreateFunctionForm({ funcName: "", consistent: 0 });
    } catch (error) {
      console.error("Ошибка создания функции:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFunction = async (id: number) => {
    setLoading(true);
    try {
      await deleteFunctionFn(id);
      setIsTfsLoaded(false);
      await fetchTFS();
      alert("Функция удалена успешно!");
      setDeleteFunctionId(0);
    } catch (error) {
      console.error("Ошибка удаления функции:", error);
    } finally {
      setLoading(false);
    }
  };

  const createDeputy = async (data: { deputyName: string }) => {
    setLoading(true);
    try {
      await createDeputyFn(data.deputyName);
      setIsDeputiesLoaded(false);
      await fetchDeputies();
      alert("Вспомогательная функция создана успешно!");
      setCreateDeputyForm({ deputyName: "" });
    } catch (error) {
      console.error("Ошибка создания вспомогательной функции:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateDeputy = async (data: { id: number; deputy_functions: number[] }) => {
    setLoading(true);
    try {
      await updateDeputyFn(data.id, data.deputy_functions);
      setIsDeputiesLoaded(false);
      await fetchDeputies();
      alert("Вспомогательная функция обновлена успешно!");
      setEditDeputyForm({ id: 0, deputy_functions: [] });
    } catch (error) {
      console.error("Ошибка обновления вспомогательной функции:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDeputy = async (id: number) => {
    setLoading(true);
    try {
      await deleteDeputyFn(id);
      setIsDeputiesLoaded(false);
      await fetchDeputies();
      alert("Вспомогательная функция удалена успешно!");
      setDeleteDeputyId(0);
    } catch (error) {
      console.error("Ошибка удаления вспомогательной функции:", error);
    } finally {
      setLoading(false);
    }
  };

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
            <TabButton
              tab="functions"
              label="Функции"
              isActive={activeTab === "functions"}
            />
            <TabButton
              tab="deputies"
              label="Вспомогательные функции"
              isActive={activeTab === "deputies"}
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
                            <option key={dept.departmentId} value={dept.departmentId}>
                              {dept.departmentName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6D6D6D] mb-2">
                          Должности
                        </label>
                        <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-3">
                          {jobs.map((job) => (
                            <label
                              key={job.jobId}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={editDepartmentForm.jobsList.includes(job.jobId)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditDepartmentForm({
                                      ...editDepartmentForm,
                                      jobsList: [...editDepartmentForm.jobsList, job.jobId],
                                    });
                                  } else {
                                    setEditDepartmentForm({
                                      ...editDepartmentForm,
                                      jobsList: editDepartmentForm.jobsList.filter(
                                        (id) => id !== job.jobId
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
                          Выбрано: {editDepartmentForm.jobsList.length} должностей
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6D6D6D] mb-2">
                          Функции
                        </label>
                        <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-3">
                          {tfsOptions.map((tfs) => (
                            <label
                              key={tfs.funcId}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={editDepartmentForm.tfs.includes(tfs.funcId)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditDepartmentForm({
                                      ...editDepartmentForm,
                                      tfs: [...editDepartmentForm.tfs, tfs.funcId],
                                    });
                                  } else {
                                    setEditDepartmentForm({
                                      ...editDepartmentForm,
                                      tfs: editDepartmentForm.tfs.filter(
                                        (id) => id !== tfs.funcId
                                      ),
                                    });
                                  }
                                }}
                                className="rounded border-gray-300 text-[#249BA2] focus:ring-[#249BA2]"
                              />
                              <span className="text-sm text-[#000000]">
                                {tfs.funcName}
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
                        if (confirm("Вы уверены, что хотите удалить этот отдел?")) {
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
                            <option key={dept.departmentId} value={dept.departmentId}>
                              {dept.departmentName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={loading || deleteDepartmentId === 0}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
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
                    label="Добавление должности"
                    isActive={positionSubTab === "create"}
                    onClick={() => setPositionSubTab("create")}
                  />
                  <SubTabButton
                    tab="edit"
                    label="Изменение должности"
                    isActive={positionSubTab === "edit"}
                    onClick={() => setPositionSubTab("edit")}
                  />
                  <SubTabButton
                    tab="delete"
                    label="Удаление должности"
                    isActive={positionSubTab === "delete"}
                    onClick={() => setPositionSubTab("delete")}
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
                      Добавить новую должность
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
                          Название должности
                        </label>
                        <input
                          type="text"
                          required
                          value={jobForm.jobName}
                          onChange={(e) =>
                            setJobForm({ ...jobForm, jobName: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#249BA2]"
                          placeholder="Введите название должности"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6D6D6D] mb-1">
                          Вспомогательная функция
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
                          <option value={0}>Выберите вспомогательную функцию</option>
                          {deputies.map((deputy) => (
                            <option key={deputy.deputyId} value={deputy.deputyId}>
                              {deputy.deputyName} (ID: {deputy.deputyId})
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 bg-[#249BA2] text-white rounded-xl hover:bg-[#1e8a90] transition-colors disabled:opacity-50"
                      >
                        {loading ? "Создание..." : "Создать должность"}
                      </button>
                    </form>
                  </div>
                )}
                {positionSubTab === "edit" && !loading && (
                  <div className="max-w-md">
                    <h3 className="text-lg font-semibold text-[#000000] mb-4">
                      Изменить должность
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
                          Выберите должность
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
                          <option value={0}>Выберите должность</option>
                          {jobs.map((job) => (
                            <option key={job.jobId} value={job.jobId}>
                              {job.jobName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6D6D6D] mb-1">
                          Вспомогательная функция
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
                          <option value={0}>Выберите вспомогательную функцию</option>
                          {deputies.map((deputy) => (
                            <option key={deputy.deputyId} value={deputy.deputyId}>
                              {deputy.deputyName} (ID: {deputy.deputyId})
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={loading || editJobForm.id === 0}
                        className="w-full px-4 py-2 bg-[#249BA2] text-white rounded-xl hover:bg-[#1e8a90] transition-colors disabled:opacity-50"
                      >
                        {loading ? "Обновление..." : "Обновить должность"}
                      </button>
                    </form>
                  </div>
                )}
                {positionSubTab === "delete" && !loading && (
                  <div className="max-w-md">
                    <h3 className="text-lg font-semibold text-[#000000] mb-4">
                      Удаление должности
                    </h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        deleteJob(deleteJobForm);
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[#6D6D6D] mb-1">
                          Выберите должность
                        </label>
                        <select
                          required
                          value={deleteJobForm.id}
                          onChange={(e) =>
                            setDeleteJobForm({
                              ...deleteJobForm,
                              id: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#249BA2]"
                        >
                          <option value={0}>Выберите должность</option>
                          {jobs.map((job) => (
                            <option key={job.jobId} value={job.jobId}>
                              {job.jobName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={loading || deleteJobForm.id === 0}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? "Удаление..." : "Удалить должность"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
            {activeTab === "functions" && (
              <div>
                <h2 className="text-2xl font-bold text-[#000000] mb-4">
                  Управление функциями
                </h2>
                <div className="flex space-x-2 mb-6">
                  <SubTabButton
                    tab="create"
                    label="Создание функции"
                    isActive={functionSubTab === "create"}
                    onClick={() => setFunctionSubTab("create")}
                  />
                  <SubTabButton
                    tab="delete"
                    label="Удаление функции"
                    isActive={functionSubTab === "delete"}
                    onClick={() => setFunctionSubTab("delete")}
                  />
                </div>
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#249BA2]"></div>
                    <span className="ml-2 text-[#6D6D6D]">Загрузка...</span>
                  </div>
                )}
                {functionSubTab === "create" && !loading && (
                  <div className="max-w-md">
                    <h3 className="text-lg font-semibold text-[#000000] mb-4">
                      Создать новую функцию
                    </h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        createFunction(createFunctionForm);
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[#6D6D6D] mb-1">
                          Название функции
                        </label>
                        <input
                          type="text"
                          required
                          value={createFunctionForm.funcName}
                          onChange={(e) =>
                            setCreateFunctionForm({
                              ...createFunctionForm,
                              funcName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#249BA2]"
                          placeholder="Введите название функции"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6D6D6D] mb-1">
                          Вспомогательная функция
                        </label>
                        <select
                          required
                          value={createFunctionForm.consistent}
                          onChange={(e) =>
                            setCreateFunctionForm({
                              ...createFunctionForm,
                              consistent: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#249BA2]"
                        >
                          <option value={0}>Выберите вспомогательную функцию</option>
                          {deputies.map((deputy) => (
                            <option key={deputy.deputyId} value={deputy.deputyId}>
                              {deputy.deputyName} (ID: {deputy.deputyId})
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 bg-[#249BA2] text-white rounded-xl hover:bg-[#1e8a90] transition-colors disabled:opacity-50"
                      >
                        {loading ? "Создание..." : "Создать функцию"}
                      </button>
                    </form>
                  </div>
                )}
                {functionSubTab === "delete" && !loading && (
                  <div className="max-w-md">
                    <h3 className="text-lg font-semibold text-[#000000] mb-4">
                      Удалить функцию
                    </h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (confirm("Вы уверены, что хотите удалить эту функцию?")) {
                          deleteFunction(deleteFunctionId);
                        }
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[#6D6D6D] mb-1">
                          Выберите функцию для удаления
                        </label>
                        <select
                          required
                          value={deleteFunctionId}
                          onChange={(e) => setDeleteFunctionId(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#249BA2]"
                        >
                          <option value={0}>Выберите функцию</option>
                          {tfsOptions.map((func) => (
                            <option key={func.funcId} value={func.funcId}>
                              {func.funcName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={loading || deleteFunctionId === 0}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? "Удаление..." : "Удалить функцию"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
            {activeTab === "deputies" && (
              <div>
                <h2 className="text-2xl font-bold text-[#000000] mb-4">
                  Управление вспомогательными функциями
                </h2>
                <div className="flex space-x-2 mb-6">
                  <SubTabButton
                    tab="create"
                    label="Создание вспомогательной функции"
                    isActive={deputySubTab === "create"}
                    onClick={() => setDeputySubTab("create")}
                  />
                  <SubTabButton
                    tab="edit"
                    label="Изменение вспомогательной функции"
                    isActive={deputySubTab === "edit"}
                    onClick={() => setDeputySubTab("edit")}
                  />
                  <SubTabButton
                    tab="delete"
                    label="Удаление вспомогательной функции"
                    isActive={deputySubTab === "delete"}
                    onClick={() => setDeputySubTab("delete")}
                  />
                </div>
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#249BA2]"></div>
                    <span className="ml-2 text-[#6D6D6D]">Загрузка...</span>
                  </div>
                )}
                {deputySubTab === "create" && !loading && (
                  <div className="max-w-md">
                    <h3 className="text-lg font-semibold text-[#000000] mb-4">
                      Создать новую вспомогательную функцию
                    </h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        createDeputy(createDeputyForm);
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[#6D6D6D] mb-1">
                          Название вспомогательной функции
                        </label>
                        <input
                          type="text"
                          required
                          value={createDeputyForm.deputyName}
                          onChange={(e) =>
                            setCreateDeputyForm({
                              ...createDeputyForm,
                              deputyName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#249BA2]"
                          placeholder="Введите название вспомогательной функции"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 bg-[#249BA2] text-white rounded-xl hover:bg-[#1e8a90] transition-colors disabled:opacity-50"
                      >
                        {loading ? "Создание..." : "Создать вспомогательную функцию"}
                      </button>
                    </form>
                  </div>
                )}
                {deputySubTab === "edit" && !loading && (
                  <div className="max-w-lg">
                    <h3 className="text-lg font-semibold text-[#000000] mb-4">
                      Изменить вспомогательную функцию
                    </h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        updateDeputy(editDeputyForm);
                      }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[#6D6D6D] mb-1">
                          Выберите вспомогательную функцию
                        </label>
                        <select
                          required
                          value={editDeputyForm.id}
                          onChange={(e) =>
                            setEditDeputyForm({
                              ...editDeputyForm,
                              id: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#249BA2]"
                        >
                          <option value={0}>Выберите вспомогательную функцию</option>
                          {deputies.map((deputy) => (
                            <option key={deputy.deputyId} value={deputy.deputyId}>
                              {deputy.deputyName} (ID: {deputy.deputyId})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6D6D6D] mb-2">
                          Основные функции
                        </label>
                        <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-3">
                          {tfsOptions.map((tfs) => (
                            <label
                              key={tfs.funcId}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={editDeputyForm.deputy_functions.includes(tfs.funcId)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditDeputyForm({
                                      ...editDeputyForm,
                                      deputy_functions: [...editDeputyForm.deputy_functions, tfs.funcId],
                                    });
                                  } else {
                                    setEditDeputyForm({
                                      ...editDeputyForm,
                                      deputy_functions: editDeputyForm.deputy_functions.filter(
                                        (id) => id !== tfs.funcId
                                      ),
                                    });
                                  }
                                }}
                                className="rounded border-gray-300 text-[#249BA2] focus:ring-[#249BA2]"
                              />
                              <span className="text-sm text-[#000000]">
                                {tfs.funcName}
                              </span>
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-[#6D6D6D] mt-1">
                          Выбрано: {editDeputyForm.deputy_functions.length} функций
                        </p>
                      </div>
                      <button
                        type="submit"
                        disabled={loading || editDeputyForm.id === 0}
                        className="w-full px-4 py-2 bg-[#249BA2] text-white rounded-xl hover:bg-[#1e8a90] transition-colors disabled:opacity-50"
                      >
                        {loading ? "Обновление..." : "Обновить вспомогательную функцию"}
                      </button>
                    </form>
                  </div>
                )}
                {deputySubTab === "delete" && !loading && (
                  <div className="max-w-md">
                    <h3 className="text-lg font-semibold text-[#000000] mb-4">
                      Удалить вспомогательную функцию
                    </h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (confirm("Вы уверены, что хотите удалить эту вспомогательную функцию?")) {
                          deleteDeputy(deleteDeputyId);
                        }
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[#6D6D6D] mb-1">
                          Выберите вспомогательную функцию для удаления
                        </label>
                        <select
                          required
                          value={deleteDeputyId}
                          onChange={(e) => setDeleteDeputyId(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#249BA2]"
                        >
                          <option value={0}>Выберите вспомогательную функцию</option>
                          {deputies.map((deputy) => (
                            <option key={deputy.deputyId} value={deputy.deputyId}>
                              {deputy.deputyName} (ID: {deputy.deputyId})
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={loading || deleteDeputyId === 0}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? "Удаление..." : "Удалить вспомогательную функцию"}
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