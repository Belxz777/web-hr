'use server'
import { host } from "@/types"
import { cookies } from "next/headers"
import { FunctionComponent } from "react"

async function getEmployees() {
    
        const cookieStore = cookies()
        const jwt = cookieStore.get('cf-auth-id')?.value
        if (!jwt) {
            throw new Error('No token provided')
        }
    try {
        const response = await fetch(`${host}users/`,
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
        console.error(error)
        throw new Error("Error occurred in getting  employees")
    }
}
export default   getEmployees