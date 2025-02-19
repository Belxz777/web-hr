'use server'
import { cookies } from "next/headers";

export async function cookieget() {
    const cookieStore = cookies();
    console.log(cookieStore)
    const jwt = cookieStore.get('cf-auth-id')?.value
    if (!jwt) {
        throw new Error('No token provided');
    }
    console.log(jwt)
    return jwt
}
export async function cookiestate() {
    return await cookies().get('cf-pos-x')?.value
}
export async function cookiedep() {
    return await cookies().get('cf-dep-x')?.value
}