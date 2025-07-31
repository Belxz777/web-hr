"use server";
import { FunctionItem, host } from "@/types";
import { cookies } from "next/headers";
import { ErrorResponse } from "../admin/job";

async function getAllFunctionsForReport(): Promise<{ message: string; data: FunctionItem[] } | ErrorResponse> {
  const cookieStore = cookies();
  const jwt = cookieStore.get("cf-auth-id")?.value;
  if (!jwt) {
    throw new Error("No token provided");
  }
  try {
    const response = await fetch(`${host}entities/functions/`, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: `jwt=${jwt}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (response.ok) {
      console.log(data,"data")
      return data

    } else {
      console.log(data,"data")
      return { message: data.message || "Unknown error occurred" };
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error occurred in getting functions");
  }
}


async function createFunctionFn(dataForm: {  name: string; is_main: boolean,description?:string  }) {
  const cookieStore = cookies();
  const jwt = cookieStore.get("cf-auth-id")?.value;
  if (!jwt) {
    throw new Error("No token provided");
  }
  try {
    console.log("Sending request to create function with data:", dataForm);
    const response = await fetch(`${host}entities/functions/`, {
      method: "POST",
      credentials: "include",
      headers: {
        Cookie: `jwt=${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataForm),
    });
    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", data);

    if (response.ok) {
      return data;
    } else {
      if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Unknown error occurred");
      }
    }
  } catch (error) {
    console.error("Error occurred in creating function:", error);
    throw new Error("Error occurred in creating employees");
  }
}

async function deleteFunctionFn(id: number) {
  const cookieStore = cookies();
  const jwt = cookieStore.get("cf-auth-id")?.value;
  if (!jwt) {
    throw new Error("No token provided");
  }
  try {
    const response = await fetch(`${host}entities/functions/?id=${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Cookie: `jwt=${jwt}`,
        "Content-Type": "application/json",
      },
    });
    
    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return { success: true };
    }
    
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Unknown error occurred");
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error occurred in deleting employees");
  }
}


export { getAllFunctionsForReport, createFunctionFn, deleteFunctionFn };
