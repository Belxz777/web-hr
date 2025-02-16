"use server";
import { host } from "@/types";

interface PerformanceData {
  employee_id: number;
  performance: Array<{
    date: string;
    report_count: number;
    total_hours: number;
  }>;
}
async function getPerformanceData(employeeId: number): Promise<any> {
  const url = `${host}users/compliancy/?emp_id=${employeeId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching performance data: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data)
  return data;
}

export default getPerformanceData;
