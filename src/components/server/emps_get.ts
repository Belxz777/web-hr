'use server'
import { cookies } from "next/headers"

async function getEmployees() {
        const cookieStore = cookies()
        const jwt = cookieStore.get('cf-auth-id')?.value
        if (!jwt) {
            throw new Error('No token provided')
        }
    try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/entities/department/5/employees/select/',
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