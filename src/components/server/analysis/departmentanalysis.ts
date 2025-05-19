"use server";
import { host } from "@/types";
import { cookies } from "next/headers";

async function analyticsDepartments(params: {
  date?: string;
  depId?: number;
  startDate?: string;
  endDate?: string;
}) {
  const cookieStore = cookies();
  const jwt = cookieStore.get("cf-auth-id")?.value;
  if (!jwt) {
    throw new Error("No token provided");
  }

  try {
    let url = "";
    const { date, depId, startDate, endDate } = params;

    // Режим analyticsDepartmentsInDay
    if (date && depId) {
      url = `${host}analytics/department/?department_id=${depId}&date=${date}`;
    }
    // Режим analyticsDepartmentInInterval
    else if (depId && startDate && endDate) {
      url = `${host}analytics/department/?department_id=${depId}&start_date=${startDate}&end_date=${endDate}`;
    }
    // Режим analyticsDepartmentsGeneral
    else if (date && !depId && !startDate && !endDate) {
      url = `${host}common/departments/?date=${date}`;
    }
    else {
      throw new Error("Invalid parameters provided");
    }

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: `jwt=${jwt}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || "Unknown error occurred");
    }
  } catch (error: any) {
    console.error("Error fetching analytics data:", error);
    throw new Error(error.message || "Error occurred in getting analytics data");
  }
}

async function analyticsDepartmentPercentage(params: {
  date?: string;
  depId: number;
  startDate?: string;
  endDate?: string;
}) {
  const cookieStore = cookies();
  const jwt = cookieStore.get("cf-auth-id")?.value;
  if (!jwt) {
    throw new Error("No token provided");
  }

  try {
    let url = `${host}analytics/department/percentage/?department_id=${params.depId}`;
    
    if (params.date) {
      // Режим analyticsDepartmentInDayPercentager (за конкретный день)
      url += `&date=${params.date}`;
    } else if (params.startDate && params.endDate) {
      // Режим analyticsDepartmentInDayPercentagerInInterval (за интервал)
      url += `&start_date=${params.startDate}&end_date=${params.endDate}`;
    } else {
      throw new Error("Invalid parameters: either date or startDate+endDate must be provided");
    }

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: `jwt=${jwt}`,
        "Content-Type": "application/json",
      },
    });
    
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || "Unknown error occurred");
    }
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || "Error occurred in getting department analytics");
  }
}


export { analyticsDepartments, analyticsDepartmentPercentage };