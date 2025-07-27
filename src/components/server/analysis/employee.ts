"use server"
import { host } from "@/types"
import { cookies } from "next/headers"

type AnalyticsType = "default" | "percentage"

async function getEmployeeAnalytics(
  empId: number,
  type: AnalyticsType = "default",
  datatype: "day" | "period",
  params?: {
    date?: string
    startDate?: string
    endDate?: string
  },
) {
  const cookieStore = cookies()
  const jwt = cookieStore.get("cf-auth-id")?.value

  if (!jwt) {
    throw new Error("No token provided")
  }

  try {
    let url = ""
    const baseEndpoint = type === "percentage" ? "analytics/employee/percentage/" : "analytics/employee/"

    if (datatype === "day") {
      // Режим analyticsDepartmentsInDay
      if (!params?.date) {
        throw new Error("Date parameter is required for day analytics")
      }
      url = `${host}${baseEndpoint}?employee_id=${empId}&date=${params.date}`
    } else if (datatype === "period") {
      // Режим analyticsDepartmentInInterval
      if (!params?.startDate || !params?.endDate) {
        throw new Error("Start date and end date parameters are required for period analytics")
      }
      url = `${host}${baseEndpoint}?employee_id=${empId}&start_date=${params.startDate}&end_date=${params.endDate}`
    } else {
      throw new Error("Invalid datatype provided. Must be 'day' or 'period'")
    }

    console.log(`Fetching ${type} analytics:`, url) // Debug log

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: `jwt=${jwt}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`HTTP ${response.status}:`, errorText)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`${type} analytics data:`, data) // Debug log

    return data
  } catch (error) {
    console.error(`Error in getEmployeeAnalytics (${type}):`, error)
    throw new Error(
      `Failed to fetch employee ${type} analytics: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}

export default getEmployeeAnalytics
