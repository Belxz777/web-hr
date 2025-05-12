"use server";

import { host } from "@/types";
import { cookies } from "next/headers";
import { FunctionComponent } from "react";

interface DepartmentData {
  departmentName: string;
  departmentDescription: string;
  headId: number;
}

async function createDepartment(departmentData: DepartmentData | any): Promise<any> {
  try {
    const response = await fetch(`${host}entities/department/create/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(departmentData),
    });

    if (!response.ok) {
      throw new Error(`Error creating department: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error instanceof Error ? error : new Error("Unknown error occurred");
  }
}

export default createDepartment;
