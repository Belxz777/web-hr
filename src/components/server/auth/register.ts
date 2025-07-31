"use server";

import { host } from "@/types";

interface CreateUserDTO {
  login: string;
  password: string;
  name: string;
  surname: string;
  patronymic: string;
  job_id: number;
  department_id: number;
}

async function registerUser(userData: CreateUserDTO): Promise<any> {
  if (!userData) {
    throw new Error("User data is required");
  }

  try {
    const response = await fetch(`${host}users/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          errorData.jobId?.[0] ||
          errorData.departmentId?.[0] ||
          `Failed to create user (Status: ${response.status})`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export default registerUser;
