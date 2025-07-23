"use client"

import { useState, useEffect } from "react"
import type { Department, Job, Deputy, Functions, ViewState } from "@/components/admin/index"

// Импорты ваших API функций
import { createDepartmentFn, deleteDepartmentFn, updateDepartmentFn } from "@/components/server/admin/department"
import useGetAlldeps from "@/hooks/useDeps"
import { getAllDeputies, createDeputyFn, deleteDeputyFn, updateDeputyFn } from "@/components/server/admin/deputy"
import { createJobFn, deleteJobFn, getAllJobs, updateJobFn } from "@/components/server/admin/jobs"
import { createFunctionFn, getAllFunctionsForReport } from "@/components/server/userdata/functions"
import DeputyForm from "@/components/admin/deputyform"
import JobForm from "@/components/admin/jobcrud"
import DepartmentForm from "@/components/admin/departmentform"
import MainView from "@/components/admin/mainview"
import DepartmentManagement from "@/components/admin/departmentcrud"
import FunctionForm from "@/components/admin/functionscrud"
import EditDeputyForm from "@/components/admin/editdeputy"
import EditJobForm from "@/components/admin/editjob"
import EditDepartmentForm from "@/components/admin/editdepartment"
import PromotionsView from "@/components/admin/prmotion"

export default function AdminPanel() {
  const [currentView, setCurrentView] = useState<ViewState>("main")
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number>(0)
  const [selectedJobId, setSelectedJobId] = useState<number>(0)
  const [selectedDeputyId, setSelectedDeputyId] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  // Используем ваш хук для отделов
  const { deps, loading: isDepsLoading, refetch } = useGetAlldeps()
  const [departments, setDepartments] = useState<Department[]>([])

  // Состояния для других данных
  const [jobs, setJobs] = useState<Job[]>([])
  const [deputies, setDeputies] = useState<Deputy[]>([])
  const [functions, setFunctions] = useState<Functions[]>([])

  // Флаги загрузки данных
  const [isJobsLoaded, setIsJobsLoaded] = useState(false)
  const [isDeputiesLoaded, setIsDeputiesLoaded] = useState(false)
  const [isFunctionsLoaded, setIsFunctionsLoaded] = useState(false)

  // Обновляем отделы из хука
  useEffect(() => {
    setLoading(isDepsLoading)
    if (deps) {
      setDepartments(deps)
    }
  }, [deps, isDepsLoading])

  // Функции загрузки данных
  const fetchJobs = async () => {
    if (isJobsLoaded) return
    setLoading(true)
    try {
      const jobsData = await getAllJobs()
      setJobs(jobsData)
      setIsJobsLoaded(true)
    } catch (error) {
      console.error("Ошибка загрузки должностей:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDeputies = async () => {
    if (isDeputiesLoaded) return
    setLoading(true)
    try {
      const deputiesData = await getAllDeputies(false)// если true то только те которые обязательные
      if (deputiesData) {
        setDeputies(deputiesData)
        setIsDeputiesLoaded(true)
      }
    } catch (error) {
      console.error("Ошибка загрузки обязанностей:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFunctions = async () => {
    if (isFunctionsLoaded) return
    setLoading(true)
    try {
      const functionsData = await getAllFunctionsForReport()
      if (functionsData) {
        setFunctions(functionsData.functions)
        setIsFunctionsLoaded(true)
      }
    } catch (error) {
      console.error("Ошибка загрузки функций:", error)
    } finally {
      setLoading(false)
    }
  }

  // Загружаем данные при необходимости
  useEffect(() => {
    if (currentView === "create_job" || currentView === "select_department") {
      if (!isDeputiesLoaded) fetchDeputies()
      if (!isJobsLoaded) fetchJobs()
    }
    if (currentView === "create_function") {
      if (!isDeputiesLoaded) fetchDeputies()
    }
  }, [currentView])

  // CRUD операции с использованием ваших API функций
  const handleCreateDepartment = async (data: { departmentName: string; departmentDescription: string }) => {
    setLoading(true)
    try {
      await createDepartmentFn(data)
      await refetch()
      alert("Отдел создан успешно!")
      setCurrentView("main")
    } catch (error) {
      console.error("Ошибка создания отдела:", error)
      alert("Ошибка создания отдела")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateJob = async (data: { jobName: string; deputy: number }) => {
    setLoading(true)
    try {
      await createJobFn(data.jobName, data.deputy)
      setIsJobsLoaded(false)
      await fetchJobs()
      alert("Должность создана успешно!")
      setCurrentView("main")
    } catch (error) {
      console.error("Ошибка создания должности:", error)
      alert("Ошибка создания должности")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDeputy = async (data: { deputyName: string,compulsory: boolean }) => {
    setLoading(true)
    try {
      await createDeputyFn({
        deputyName: data.deputyName,
        compulsory: data.compulsory,
      })
      setIsDeputiesLoaded(false)
      await fetchDeputies()
      alert("Вспомогательная обязанность создана успешно!")
      setCurrentView("main")
    } catch (error) {
      console.error("Ошибка создания обязанности:", error)
      alert("Ошибка создания обязанности")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateFunction = async (data: { funcName: string; consistent: number }) => {
    setLoading(true)
    try {
      await createFunctionFn(data)
      setIsFunctionsLoaded(false)
      await fetchFunctions()
      alert("Функция создана успешно!")
      setCurrentView("main")
    } catch (error) {
      console.error("Ошибка создания функции:", error)
      alert("Ошибка создания функции")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDepartment = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот отдел?")) return

    setLoading(true)
    try {
      await deleteDepartmentFn(id)
      await refetch()
      alert("Отдел удален успешно!")
    } catch (error) {
      console.error("Ошибка удаления отдела:", error)
      alert("Ошибка удаления отдела")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteJob = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить эту должность?")) return

    setLoading(true)
    try {
      await deleteJobFn(id)
      setIsJobsLoaded(false)
      await fetchJobs()
      alert("Должность удалена успешно!")
    } catch (error) {
      console.error("Ошибка удаления должности:", error)
      alert("Ошибка удаления должности")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDeputy = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить эту обязанность?")) return

    setLoading(true)
    try {
      await deleteDeputyFn(id)
      setIsDeputiesLoaded(false)
      await fetchDeputies()
      alert("Обязанность удалена успешно!")
    } catch (error) {
      console.error("Ошибка удаления обязанности:", error)
      alert("Ошибка удаления обязанности")
    } finally {
      setLoading(false)
    }
  }

  // Заглушки для редактирования (можно доработать позже)
  const handleEditDepartment = (id: number) => {
    setSelectedDepartmentId(id)
    setCurrentView("edit_department")
  }

  const handleEditJob = (id: number) => {
    setSelectedJobId(id)
    setCurrentView("edit_job")
  }

  const handleManageDeputy = (id: number) => {
    setSelectedDeputyId(id)
    setCurrentView("edit_deputy")
  }


  const handleNavigate = (view: ViewState) => {
    setCurrentView(view)
  }
const handleUpdateDepartment = async (data: { id: number; jobsList: number[];}) => {
    setLoading(true)
    try {
      await updateDepartmentFn(data.id, data.jobsList)
      await refetch()
      alert("Отдел обновлен успешно!")
      setCurrentView("select_department")
    } catch (error) {
      console.error("Ошибка обновления отдела:", error)
      alert("Ошибка обновления отдела")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateJob = async (data: { id: number; deputy: number }) => {
    setLoading(true)
    try {
      await updateJobFn(data.id, data.deputy)
      setIsJobsLoaded(false)
      await fetchJobs()
      alert("Должность обновлена успешно!")
      setCurrentView("select_department")
    } catch (error) {
      console.error("Ошибка обновления должности:", error)
      alert("Ошибка обновления должности")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateDeputy = async (data: { id: number; deputy_functions: number[] }) => {
    setLoading(true)
    try {
      await updateDeputyFn(data.id, data.deputy_functions)
      setIsDeputiesLoaded(false)
      await fetchDeputies()
      alert("Обязанность обновлена успешно!")
      setCurrentView("select_department")
    } catch (error) {
      console.error("Ошибка обновления обязанности:", error)
      alert("Ошибка обновления обязанности")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
        
      {loading && <div className="fixed top-4 right-4 bg-blue-100 text-blue-800 px-4 py-2 rounded">Загрузка...</div>}

      {currentView === "main" && <MainView onNavigate={handleNavigate} />}

      {currentView === "create_department" && (
        <DepartmentForm onBack={() => setCurrentView("main")} onSubmit={handleCreateDepartment} loading={loading} /> 
      )}

      {currentView === "create_job" && (
        <JobForm
          deputies={deputies}
          onBack={() => setCurrentView("main")}
          onSubmit={handleCreateJob}
          loading={loading}
        /> //works
      )}

      {currentView === "create_deputy" && (
        <DeputyForm onBack={() => setCurrentView("main")} onSubmit={handleCreateDeputy} loading={loading} /> //works
      )}

      {currentView === "create_function" && (
        <FunctionForm
          deputies={deputies}
          onBack={() => setCurrentView("main")}
          onSubmit={handleCreateFunction}
          loading={loading}
        /> //works
      )}

      {currentView === "select_department" && (
        <DepartmentManagement
          departments={departments}
          jobs={jobs}
          deputies={deputies}
          onBack={() => setCurrentView("main")}
          onCreateJob={() => setCurrentView("create_job")}
          onEditDepartment={handleEditDepartment}
          onDeleteDepartment={handleDeleteDepartment}
          onEditJob={handleEditJob}
          onDeleteJob={handleDeleteJob}
          onManageDeputy={handleManageDeputy}
          onDeleteDeputy={handleDeleteDeputy}
          loading={loading}
        />
      )}
       {currentView === "edit_department" && (
        <EditDepartmentForm
          department={departments.find((d) => d.departmentId === selectedDepartmentId)!}
          jobs={jobs}
          onBack={() => setCurrentView("select_department")}
          onSubmit={handleUpdateDepartment}
          loading={loading}
        />
      )}

      {currentView === "edit_job" && (
        <EditJobForm
          job={jobs.find((j) => j.jobId === selectedJobId)!}
          deputies={deputies}
          onBack={() => setCurrentView("select_department")}
          onSubmit={handleUpdateJob}
          loading={loading}
        />
      )}

      {currentView === "edit_deputy" && (
        <EditDeputyForm
          deputy={deputies.find((d) => d.deputyId === selectedDeputyId)!}
          allFunctions={functions}
          onBack={() => setCurrentView("select_department")}
          onSubmit={handleUpdateDeputy}
          loading={loading}
        />
      )}
          {currentView === "promotions" && (
        <PromotionsView onBack={() => setCurrentView("main")} departments={departments} loading={loading} />
      )}
    </div>
  )
}
