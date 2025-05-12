"use server"
import { host } from "@/types"
import { cookies } from "next/headers"

export async function downloadReport() {
    const cookieStore = cookies()
    const jwt = cookieStore.get('cf-auth-id')?.value
    if (!jwt) {
        throw new Error('No token provided')
    }
    const res = await (await fetch(`${host}report/department/xlsx/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Cookie: `jwt=${jwt}`,
            'Content-Type': 'application/json'
        },
    }))
    if (!res.ok) {
        console.log(res.status)
      throw new Error('Failed to download report')
    }
    return res
}

export async function downloadPreciseReport(employee_ids: number[], from_date: string, end_date: string) {
    const cookieStore = cookies()
    const jwt = cookieStore.get('cf-auth-id')?.value
    if (!jwt) {
        throw new Error('No token provided')
    }

    const body = {
        employee_ids: [1],
        from_date: "2024-12-21",
        end_date: "2024-12-25"
    }

    const res = await (await fetch('http://127.0.0.1:8000/api/v1/report/department/xlsx/persice', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }))

    if (!res.ok) {
        console.log(res.status)
        throw new Error('Failed to download precise report')
    }
    return res
}
