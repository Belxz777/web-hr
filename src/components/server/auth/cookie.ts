'use server'
import { cookies } from "next/headers";

export async function cookieget() {
    const cookieStore = cookies();
    const jwt = cookieStore.get('cf-auth-id')?.value
    if (!jwt) {
        throw new Error('No token provided');
    }
    return jwt
}