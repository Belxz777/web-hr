"use server"
import { cookies } from 'next/headers';
import { host } from '@/types';
async function authUser(): Promise<any> {
    const cookieStore = cookies();
    const jwt = cookieStore.get('jwt')?.value;
    if (!jwt) {
        throw new Error('No token provided');
    }
    
    const res = await fetch(`${host}users/get_user`, {
        credentials: 'include',
        headers: {
            Cookie: `jwt=${jwt}`
        }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch user data');
    }

    return res.json();
}

export default authUser;