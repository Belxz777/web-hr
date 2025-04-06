"use server";
import { host } from "@/types";
import { cookies } from "next/headers";

async function allTfByDepartment(
  type: "all" | "department" | "employee",
  id?: number
): Promise<any> {
  const cookieStore = cookies();
  const jwt = cookieStore.get("cf-auth-id")?.value;
  if (!jwt) {
    throw new Error("No token provided");
  }

  let url = "";
  switch (type) {
    case "all":
      url = `${host}entities/tf`;
      break;
    case "department":
      if (!id) throw new Error("Department ID is required for department type");
      url = `${host}entities/tf/department?id=${id}`;
      break;
    case "employee":
      url = `${host}entities/tf/employee`;
      break;
    default:
      throw new Error("Invalid type provided");
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
      const error = new Error(`Error fetching TFs: ${response.statusText}`);
      throw error;
    }

    const data = await response.json();
    if (!data) {
      throw new Error("No data returned from server");
    }
    return data;
  } catch (error) {
    console.error("error ", error);
    throw new Error("Error occurred in getting TFs");
  }
}

export default allTfByDepartment;
