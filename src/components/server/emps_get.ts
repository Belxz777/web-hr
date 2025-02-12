'use server'
import { host } from "@/types"
import { cookies } from "next/headers"
import { FunctionComponent } from "react"

async function getEmployees(departmentId: any) {
    console.log("{departmentId}", departmentId);
    
        const cookieStore = cookies()
        const jwt = cookieStore.get('cf-auth-id')?.value
        if (!jwt) {
            throw new Error('No token provided')
        }
    try {
        const response = await fetch(`${host}entities/department/employees/select/?department_id=${departmentId}`,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Cookie: `jwt=${jwt}`,
                    'Content-Type': 'application/json'
                },
            }
        )
        const data = await response.json()

        if (response.ok) {
            return data
        } else {
            if (data.error) {
                throw new Error(data.error)
            } else {
                throw new Error('Unknown error occurred')
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching employees:', error.message)
        } else {
            console.error('Error fetching employees:', String(error))
        }
    }
}
export default   getEmployees