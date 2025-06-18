import { host } from "@/types";

async function getAllDeputies(): Promise<any> {
  try {
    const response = await fetch(`${host}entities/deputy/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error getting deputies: ${response.statusText}`);
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

export { getAllDeputies };