"use server"
import { host } from "@/types";

async function getAllDepartments() {
  try {
    const response = await fetch(
      `${host}entities/departments/overall/`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching deps: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Unknown error occurred");
    }
  }
}
export default getAllDepartments;