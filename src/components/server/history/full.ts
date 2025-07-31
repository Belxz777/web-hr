// Утилиты для работы с API
"use server"
import { host } from "@/types"

export type DepartmentPerformanceData = {
  department_id: number
  department_name: string
  start_date: string
  end_date: string
  total_hours: number
  reports_by_date: {
    [date: string]: Array<{
      report_id: number
      employee_id: number
      employee_name: string
      function_id: number
      function_name: string
      hours_worked: number
      comment: string,
      date:string
    }>
  }
}

export type EmployeePerformanceData = {
  employee_id: number
  employee_name: string
  department_id: number
  department_name: string
  start_date: string
  end_date: string
  total_hours: number
  reports_by_date: {
    [date: string]: Array<{
      report_id: number
      function_id: number
      function_name: string
      hours_worked: number
      comment: string
      date: string
    }>
  }
}

export type ApiResponse<T> = {
  message: string
  data?: T
  error?: string
}

// Функция для получения данных отдела
export async function fetchDepartmentData(
  departmentId: number,
  startDate: string,
  endDate: string,
): Promise<ApiResponse<DepartmentPerformanceData>> {
  try {
    const url = `${host}history/department?department_id=${departmentId}&start_date=${startDate}&end_date=${endDate}`
    const response = await fetch(url)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Ошибка при получении данных отдела")
    }

    return await response.json()
  } catch (error) {
    console.error("Ошибка при запросе данных отдела:", error)
    throw error
  }
}

// Функция для получения данных сотрудника
export async function fetchEmployeeData(
  employeeId: number,
  startDate: string,
  endDate: string,
): Promise<ApiResponse<EmployeePerformanceData>> {
  try {
    const url = `${host}history/employee?emp_id=${employeeId}&start_date=${startDate}&end_date=${endDate}`
    const response = await fetch(url)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Ошибка при получении данных сотрудника")
    }

    return await response.json()
  } catch (error) {
    console.error("Ошибка при запросе данных сотрудника:", error)
    throw error
  }
}

// Функция для сохранения данных отдела
export async function saveDepartmentData(data: {
  department_id: number
  start_date: string
  end_date: string
  reports: any[]
}): Promise<ApiResponse<any>> {
  try {
    const response = await fetch("/api/history/department", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Ошибка при сохранении данных отдела")
    }

    return await response.json()
  } catch (error) {
    console.error("Ошибка при сохранении данных отдела:", error)
    throw error
  }
}

// Функция для сохранения данных сотрудника
export async function saveEmployeeData(data: {
  employee_id: number
  start_date: string
  end_date: string
  reports: any[]
}): Promise<ApiResponse<any>> {
  try {
    const response = await fetch("/api/history/employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Ошибка при сохранении данных сотрудника")
    }

    return await response.json()
  } catch (error) {
    console.error("Ошибка при сохранении данных сотрудника:", error)
    throw error
  }
}
