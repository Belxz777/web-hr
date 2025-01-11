'use server'
import { cookies } from "next/headers";

async function logout() {
   const cookiesApi = cookies()

   cookiesApi.delete('cf-auth-id')
   cookiesApi.delete('cf-pos-x')
   cookiesApi.delete('cf-dep-x')
}
export {logout}