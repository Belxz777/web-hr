'use server'
import { cookies } from "next/headers";

async function logout() {
   const cookiesApi = cookies()

   cookiesApi.delete('jwt')
}
export {logout}