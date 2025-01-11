"use server"
import { cookies } from "next/headers";

export  async function checkCookie():Promise<boolean>{
    const cookiesStore = cookies()
    const jwt = cookiesStore.get('cf-auth-id')?.value
    if(!jwt){
        return false
    }
    return true

}