"use server";
import { defaultTF, host } from "@/types";
import { cookies } from "next/headers";

async function createTF(dataTF: defaultTF): Promise<any> {
  const cookieStore = cookies();
  const jwt = cookieStore.get("cf-auth-id")?.value;

  if (!jwt) throw new Error("No token provided");

  try {
    const requestBody = {
      tfName: dataTF.tfName,
      tfDescription: dataTF.tfDescription || null,
      time: String(dataTF.time),
      isMain: dataTF.isMain
    };


    const response = await fetch(`${host}entities/tf/`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `jwt=${jwt}; cf-auth-id=${jwt}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Server response:", errorData);
      throw new Error(errorData.message || `HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
}
export default createTF;
