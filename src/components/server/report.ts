"use server";
import { host, report, task } from "@/types";
import { cookies } from "next/headers";

export default async function sendReport(reportData: report) {
  const cookieStore = cookies();
  const jwt = cookieStore.get("cf-auth-id")?.value;
  if (!jwt) {
    throw new Error("No token provided");
  }
  const parsedReportData = {
    ...reportData,
  };
  const res = await fetch(
    `${host}fill/progress/`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        Cookie: `jwt=${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedReportData),
    }
  );
  if (!res.ok) {
    console.log(res);
    return false;
  }
  return true;
}
