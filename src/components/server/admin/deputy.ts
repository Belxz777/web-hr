"use server";
import { host } from "@/types";
import { cookies } from "next/headers";

async function getAllDeputies(onlycompulsory:boolean): Promise<any> {
  try {
    const cookieStore = cookies();
    const jwt = cookieStore.get("cf-auth-id")?.value;

    const response = await fetch(`${host}entities/deputy/?only_compulsory=${onlycompulsory}`, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: `jwt=${jwt}; cf-auth-id=${jwt}`,
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

async function createDeputyFn({
  deputyName,
  compulsory,
}: {
  deputyName: string;
  compulsory: boolean;
}): Promise<any> {
  try {
    const cookieStore = cookies();
    const jwt = cookieStore.get("cf-auth-id")?.value;

    const response = await fetch(`${host}entities/deputy/`, {
      method: "POST",
      credentials: "include",
      headers: {
        Cookie: `jwt=${jwt}; cf-auth-id=${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deputyName,compulsory}),
    });

    if (!response.ok) {
      throw new Error(`Error creating deputies: ${response.statusText}`);
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

async function updateDeputyFn(depId: number,deputy_functions: number[]): Promise<any> {
  try {
    const cookieStore = cookies();
    const jwt = cookieStore.get("cf-auth-id")?.value;

    const response = await fetch(`${host}entities/deputy/?id=${depId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        Cookie: `jwt=${jwt}; cf-auth-id=${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deputy_functions }),
    });

    if (!response.ok) {
      throw new Error(`Error creating deputies: ${response.statusText}`);
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

async function deleteDeputyFn(depId: number): Promise<any> {
  try {
    const cookieStore = cookies();
    const jwt = cookieStore.get("cf-auth-id")?.value;

    const response = await fetch(`${host}entities/deputy/?id=${depId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Cookie: `jwt=${jwt}; cf-auth-id=${jwt}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return { success: true };
    }

    if (!response.ok) {
      throw new Error(`Error creating deputies: ${response.statusText}`);
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

export { getAllDeputies, createDeputyFn, updateDeputyFn, deleteDeputyFn };
