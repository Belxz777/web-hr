"use server";
import { host } from "@/types";
async function getAllJobs(): Promise<any> {
  try {
    const response = await fetch(
      `${host}entities/jobs/`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching jobs: ${response.statusText}`);
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


async function createJobFn(name:string, deputy: number): Promise<any> {
  try {
    const response = await fetch(
      `${host}entities/jobs/`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobName:name, deputy }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error creating jobs: ${response.statusText}`);
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

async function updateJobFn(id:number, deputy: number): Promise<any> {
  try {
    const response = await fetch(
      `${host}entities/job/?id=${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deputy }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error updating jobs: ${response.statusText}`);
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

async function deleteJobFn(id: number): Promise<any> {
  try {
    const response = await fetch(
      `${host}entities/job/?id=${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error deleting job: ${response.statusText}`);
    }

    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return { success: true };
    }

    const data = await response.json();
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

export { getAllJobs, createJobFn, updateJobFn, deleteJobFn };