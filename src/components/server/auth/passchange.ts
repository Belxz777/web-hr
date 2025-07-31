"use server";

import { cookies } from "next/headers";
import { changePass, host } from "@/types";

async function changePassword(passwordData: changePass): Promise<any> {
  if (!passwordData) {
    throw new Error("Password data is required");
  }
  const cookieStore = cookies();
  const jwt = cookieStore.get("cf-auth-id")?.value;
  if (!jwt) {
    throw new Error("No token provided");
  }
  try {
    const response = await fetch(`${host}users/change_password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `jwt=${jwt}`,
      },
      body: JSON.stringify(passwordData),
    });
    return response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function resetPasswordFn(passwordData: {
  admin_password: string;
  new_password: string;
  user_id: number;
}): Promise<any> {
  if (!passwordData) {
    throw new Error("Password data is required");
  }
  try {
    console.log("Sending request to reset password", passwordData);
    const response = await fetch(`${host}users/reset_password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwordData),
    });
    console.log("Response from reset password", response);
    return response.json();
  } catch (err) {
    console.error("Error resetting password", err);
    throw err;
  }
}

export { changePassword, resetPasswordFn };
