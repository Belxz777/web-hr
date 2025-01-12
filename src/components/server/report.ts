'use server'
import { host, report, task } from "@/types";
import { cookies } from "next/headers";

export default async function sendReport(reportData:report) {
    const cookieStore = cookies();
    const jwt = cookieStore.get('cf-auth-id')?.value
    if(!jwt){
        throw new Error('No token provided')
    }
        // Convert taskId and workingHours from string to number
        const parsedReportData = {
            ...reportData,
            taskId: Number(reportData.taskId),
            workingHours: Number(reportData.workingHours)
        };
    console.log(parsedReportData)
        const res = await (await fetch(`${host}fill/progress/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                Cookie: `jwt=${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                 parsedReportData
            )
        }))
        if(!res.ok) {
            console.log(res.status)
            return false
        }
        return true
    }
    