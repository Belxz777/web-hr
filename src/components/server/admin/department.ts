"use server";

import { host } from "@/types";
import { cookies } from "next/headers";
import { FunctionComponent } from "react";

interface DepartmentData {
  departmentName: string;
  departmentDescription: string;
  // headId: number;
}

async function createDepartmentFn(
  departmentData: DepartmentData | any
): Promise<any> {
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

async function deleteDepartmentFn(depId: number): Promise<void> {
  try {
    const response = await fetch(`${host}entities/department/?id=${depId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error deleting department: ${error.error || response.statusText}`);
    }
  } catch (error) {
    console.error(error);
    throw error instanceof Error ? error : new Error("Unknown error occurred");
  }
}
async function updateDepartmentFn(depId: number,jobsList: number[], tfs: number[] ): Promise<void> {
  try {
    const response = await fetch(`${host}entities/department/?id=${depId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobsList, tfs
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error updating department: ${error.error || response.statusText}`);
    }
  } catch (error) {
    console.error(error);
    throw error instanceof Error ? error : new Error("Unknown error occurred");
  }
}

export { createDepartmentFn, deleteDepartmentFn, updateDepartmentFn };
