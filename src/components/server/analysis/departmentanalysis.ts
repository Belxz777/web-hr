"use server";
import { host } from "@/types";
import { cookies } from "next/headers";

interface AnalyticsParams {
  date?: string;
  depId?: number;
  startDate?: string;
  endDate?: string;
}

async function fetchWithAuth(url: string) {
  const cookieStore = cookies();
  const jwt = cookieStore.get("cf-auth-id")?.value;
  
  if (!jwt) {
    throw new Error("No authentication token provided");
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: `jwt=${jwt}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Fetch error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Fetch error:", error);
    throw new Error(`Failed to fetch data from ${url}: ${error.message}`);
  }
}

async function analyticsDepartments(params: AnalyticsParams) {
  try {
    const { date, depId, startDate, endDate } = params;
    const queryParams = new URLSearchParams();

    if (depId) {
      queryParams.append('department_id', depId.toString());
    } else {
      queryParams.append('is_auto', 'true');
    }

    if (date) {
      queryParams.append('date', date);
    } else if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        throw new Error("Start date cannot be after end date");
      }
      queryParams.append('start_date', startDate);
      queryParams.append('end_date', endDate);
    }

    const url = `${host}analytics/department/?${queryParams.toString()}`;
    console.log("Request URL:", url); // Для отладки
    
    return await fetchWithAuth(url);
  } catch (error: any) {
    console.error("Analytics departments error:", error.message);
    throw new Error(`Failed to get department analytics: ${error.message}`);
  }
}

async function analyticsDepartmentPercentage(params: AnalyticsParams) {
  try {
    const { date, depId, startDate, endDate } = params;
    
    if (!date && !(startDate && endDate)) {
      throw new Error("Either date or both startDate and endDate must be provided");
    }

    const queryParams = new URLSearchParams();

    if (depId) {
      queryParams.append('department_id', depId.toString());
    } else {
      queryParams.append('is_auto', 'true');
    }

    if (date) {
      queryParams.append('date', date);
    } else {
      if (new Date(startDate!) > new Date(endDate!)) {
        throw new Error("Start date cannot be after end date");
      }
      queryParams.append('start_date', startDate!);
      queryParams.append('end_date', endDate!);
    }

    const url = `${host}analytics/department/percentage/?${queryParams.toString()}`;
    console.log("Request URL:", url); // Для отладки
    
    return await fetchWithAuth(url);
  } catch (error: any) {
    console.error("Department percentage error:", error.message);
    throw new Error(`Failed to get department percentage: ${error.message}`);
  }
}

export { analyticsDepartments, analyticsDepartmentPercentage };