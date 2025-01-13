'use server'
import { cookies } from "next/headers";

export async function cookieget() {
    const cookieStore = cookies();
    const jwt = cookieStore.get('cf-auth-id')?.value;
    return jwt
}
export async function cookiestate() {
    return await cookies().get('cf-pos-x')?.value
}