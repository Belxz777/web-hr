"use server";
import { host } from "@/types";
import { cookies } from "next/headers";
import { FunctionComponent } from "react";

async function allTfByDepartment(id: number): Promise<any> {
  const cookieStore = cookies();
  const jwt = cookieStore.get("cf-auth-id")?.value;
  if (!jwt) {
    throw new Error("No token provided");
  }
  try {
    const response = await fetch(`${host}entities/tf/department?id=${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: `jwt=${jwt}`,
       "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = new Error(
        `Error fetching TFs by department: ${response.statusText}`
      );
      throw error;
    }

    const data = await response.json();
    if (!data) {
      throw new Error("No data returned from server");
    }
    return data;
  } catch (error) {
    console.error("error ", error);
    throw new Error("Error occurred in getting employees");
  }
}
export default allTfByDepartment;
