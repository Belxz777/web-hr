"use server";
import { host } from "@/types";
import { cookies } from "next/headers";
import { FunctionComponent } from "react";

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
    console.log(response);

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
export default getAllJobs;
