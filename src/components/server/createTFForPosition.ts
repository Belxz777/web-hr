"use server";
import { defaultTF, host } from "@/types";
import { cookies } from "next/headers";

async function createTFForPosition(dataTF: any): Promise<any> {
  const cookieStore = cookies();
  const jwt = cookieStore.get("cf-auth-id")?.value;
  if (jwt === null || jwt === undefined) {
    throw new Error("No token provided");
  }
  try {
    if (dataTF === null || dataTF === undefined) {
      throw new Error("No data provided");
    }

    const response = await fetch(`${host}entities/job/?id=${dataTF.jobId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        Cookie: `jwt=${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({typicalfunctions: [dataTF.tfId]}),
    });

    if (!response.ok) {
      const error = new Error(
        `Error creating TFs by department: ${response.statusText}`
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
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Unknown error occurred");
    }
  }
}
export default createTFForPosition;
