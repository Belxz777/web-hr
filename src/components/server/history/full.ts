"use server"

import { host } from "@/types"

export type PaginationData = {
  current_page: number
  page_size: number
  total_reports: number
  total_pages: number
  has_next: boolean
  has_previous: boolean
  next_page?: string
}

export type DepartmentPerformanceData = {
  department_id: number
  department_name: string
  start_date: string
  end_date: string
  total_hours: number
  pagination: PaginationData
  reports_by_date: {
    [date: string]: Array<{
      report_id: number
      employee_id: number
      employee_name: string
      function: {
        id: number
        name: string
      }
      hours_worked: number
      comment: string
      full_date: string
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

// Функция для получения данных отдела с пагинацией
export async function fetchDepartmentData(
  departmentId: number,
  startDate: string,
  endDate: string,
  page = 1,
  pageSize = 10,
): Promise<ApiResponse<DepartmentPerformanceData>> {
  try {
    const url = `${host}history/department/?department_id=${departmentId}&start_date=${startDate}&end_date=${endDate}&page=${page}&page_size=${pageSize}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.log(response)
      return {
        message: "Error",
        error: errorData.error || "Ошибка при получении данных",
      }
    }

    return await response.json()
  } catch (error) {
    console.error("Ошибка при запросе данных отдела:", error)
    return {
      message: "Error",
      error: error instanceof Error ? error.message : "Неизвестная ошибка",
    }
  }
}

// Функция для получения данных сотрудника
export async function fetchEmployeeData(
  employeeId: number,
  startDate: string,
  endDate: string,
): Promise<ApiResponse<EmployeePerformanceData>> {
  try {
    const url = `${host}history/employee/?emp_id=${employeeId}&start_date=${startDate}&end_date=${endDate}`
    const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
    )

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
