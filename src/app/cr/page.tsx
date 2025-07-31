"use client"

import { useState, useEffect } from "react"
import type { Deputy, Functions, ViewState } from "@/components/admin/index"

// Импорты ваших API функций
import { createDepartment, deleteDepartment, updateDepartment } from "@/components/server/admin/department"
import useGetAlldeps from "@/hooks/useDeps"
import { getAllDeputies, createDeputyFn, deleteDeputyFn, updateDeputyFn } from "@/components/server/admin/deputy"
import { createJob, deleteJob, getAllJobs, updateJob } from "@/components/server/admin/job"
import { createFunctionFn, getAllFunctionsForReport } from "@/components/server/userdata/functions"
import JobForm from "@/components/admin/jobcrud"
import DepartmentForm from "@/components/admin/departmentform"
import MainView from "@/components/admin/mainview"
import DepartmentManagement from "@/components/admin/departmentcrud"
import FunctionForm from "@/components/admin/functionscrud"
import PromotionsView from "@/components/admin/prmotion"
import { Department, FunctionItem, Job } from "@/types"

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
  const [functions, setFunctions] = useState<FunctionItem[]>([])

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
       if ("data" in jobsData) {
         setJobs(jobsData.data)
        } 
      setIsJobsLoaded(true)
    } catch (error) {
      console.error("Ошибка загрузки должностей:", error)
    } finally {
      setLoading(false)
    }
  }


useEffect(()=>{
fetchFunctions()
fetchJobs()
},[])
  const fetchFunctions = async () => {
    if (isFunctionsLoaded) return
    setLoading(true)
    try {
      const functionsData = await getAllFunctionsForReport()
     if ("data" in functionsData) {
          setFunctions(functionsData.data);
          console.log()
        } 
    } catch (error) {
      console.error("Ошибка загрузки функций:", error)
    } finally {
      setLoading(false)
    }
  }

  // Загружаем данные при необходимости
  // CRUD операции с использованием ваших API функций
  const handleCreateDepartment = async (data: { name: string; description: string }) => {
    setLoading(true)
    try {
      await createDepartment(data)
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

  const handleCreateJob = async (data: { name: string; }) => {
    setLoading(true)
    try {
      await createJob({name: data.name})
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

 

  const handleCreateFunction = async (data: { name: string; is_main: boolean,description?:string }) => {
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
      await deleteDepartment(id)
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
      await deleteJob(id)
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



  // Заглушки для редактирования (можно доработать позже)
  const handleEditDepartment = (id: number) => {
    setSelectedDepartmentId(id)
    setCurrentView("edit_department")
  }

  const handleEditJob = (id: number) => {
    setSelectedJobId(id)
    setCurrentView("edit_job")
  }

 


  const handleNavigate = (view: ViewState) => {
    setCurrentView(view)
  }
const handleUpdateDepartment = async (data: { id: number; jobsList: number[];}) => {
    setLoading(true)
    try {
      await updateDepartment(data.id,{
        jobs_list: data.jobsList,
      })
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

  // const handleUpdateJob = async (data: { id: number; deputy: number }) => {
  //   setLoading(true)
  //   try {
  //     await updateJob(data.id,)
  //     setIsJobsLoaded(false)
  //     await fetchJobs()
  //     alert("Должность обновлена успешно!")
  //     setCurrentView("select_department")
  //   } catch (error) {
  //     console.error("Ошибка обновления должности:", error)
  //     alert("Ошибка обновления должности")
  //   } finally {
  //     setLoading(false)
  //   }
  // }

 

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
        
      {loading && <div className="fixed top-4 right-4 bg-blue-100 text-blue-800 px-4 py-2 rounded">Загрузка...</div>}

      {currentView === "main" && <MainView onNavigate={handleNavigate} />}

      {currentView === "create_department" && (
        <DepartmentForm onBack={() => setCurrentView("main")} onSubmit={handleCreateDepartment} loading={loading} /> 
      )}

      {currentView === "create_job" && (
        <JobForm
          onBack={() => setCurrentView("main")}
          onSubmit={handleCreateJob}
          loading={loading}
        /> //works
      )}

      {/* {currentView === "create_deputy" && (
        <DeputyForm onBack={() => setCurrentView("main")} onSubmit={handleCreateDeputy} loading={loading} /> //works
      )} */}

      {currentView === "create_function" && (
        <FunctionForm
          onBack={() => setCurrentView("main")}
          onSubmit={handleCreateFunction}
          loading={loading}
        /> //works
      )}

      {currentView === "select_department" && (
        <DepartmentManagement
          departments={departments}
          jobs={jobs}
          functions={functions}
          onBack={() => setCurrentView("main")}
          onCreateJob={() => setCurrentView("create_job")}
          onEditDepartment={handleEditDepartment}
          onDeleteDepartment={handleDeleteDepartment}
          onEditJob={handleEditJob}
          onDeleteJob={handleDeleteJob}
          loading={loading}
        />
      )}
       {/* {currentView === "edit_department" && (
        <EditDepartmentForm
          department={departments.find((d) => d.id === selectedDepartmentId)!}
          jobs={jobs}
          onBack={() => setCurrentView("select_department")}
          onSubmit={handleUpdateDepartment}
          loading={loading}
        />
      )} */}

      {/* {currentView === "edit_job" && (
        <EditJobForm
          job={jobs.find((j) => j.jobId === selectedJobId)!}
          deputies={deputies}
          onBack={() => setCurrentView("select_department")}
          onSubmit={handleUpdateJob}
          loading={loading}
        />
      )} */}

          {currentView === "promotions" && (
        <PromotionsView onBack={() => setCurrentView("main")} departments={departments} loading={loading} />
      )}
    </div>
  )
}
