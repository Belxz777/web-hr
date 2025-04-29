"use server";
import { host } from "@/types";

interface PerformanceData {
  department: string;
  performance: Array<{
    date: string;
    report_count: number;
    total_hours: number;
  }>;
}
async function getDepartmentPerformanceData(
  departmentId: number
): Promise<PerformanceData> {
  const url = `${host}history/department/?department_id=${departmentId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(response);
  if (!response.ok) {
    throw new Error(`Error fetching performance data: ${response.statusText}`);
  }

  const data = (await response.json()) as PerformanceData;
  return data;
}

export default getDepartmentPerformanceData;
