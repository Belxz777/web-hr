"use server";
import { host } from "@/types";
import { cookies } from "next/headers";

async function analyticsEmployeeInInterval(empId: number, startDate:string, endDate: string) {
  const cookieStore = cookies();
  const jwt = cookieStore.get("cf-auth-id")?.value;
  if (!jwt) {
    throw new Error("No token provided");
  }
  try {
    const response = await fetch(`${host}analytics/employee/?employee_id=${empId}&start_date=${startDate}&end_date=${endDate}`, {
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
      if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Unknown error occurred");
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error occurred in getting employee info");
  }
}
export default analyticsEmployeeInInterval;
