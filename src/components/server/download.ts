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
    return res.blob()
}