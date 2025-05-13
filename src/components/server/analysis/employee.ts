"use server";
import { host } from "@/types";
import { cookies } from "next/headers";

type AnalyticsType = "default" | "percentage";

async function getEmployeeAnalytics(
  empId: number,
  type: AnalyticsType = "default",
  datatype:'day' |'period',
  params?: {
    date?: string;
    startDate?: string;
    endDate?: string;
  }
) {
  const cookieStore = cookies();
  const jwt = cookieStore.get("cf-auth-id")?.value;
  
  if (!jwt) {
    throw new Error("No token provided");
  }

  const endpoint = type === "percentage" 
    ? "analytics/employee/percentage/" 
    : "analytics/employee/";

  try {
    let url = "";
    if (datatype === 'day') {
      // Режим analyticsDepartmentsInDay

      url = `${host}analytics/employee/?employee_id=${empId}&date=${params?.date}`;
    } else if (datatype === 'period') {
      // Режим analyticsDepartmentInInterval
      url = `${host}analytics/employee/?employee_id=${empId}&start_date=${params?.startDate}&end_date=${params?.endDate}`;
    } else {
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
  } catch (error) {
    console.error(error);
    throw new Error(
      `Error occurred in getting employee ${type} analytics`
    );
  }
}

export default getEmployeeAnalytics;