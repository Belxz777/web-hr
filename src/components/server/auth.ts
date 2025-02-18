"use server"
import { cookies } from 'next/headers';
import { host } from '@/types';
async function authUser(): Promise<any> {
    const cookieStore = cookies();
    const jwt = cookieStore.get('cf-auth-id')?.value;
    if (!jwt) {
        throw new Error('No token provided');
    }
    try{     
    const res = await fetch(`${host}users/get_user`, {
        credentials: 'include',
        headers: {
            Cookie: `jwt=${jwt}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch user data');
    }

    return res.json();
    }
    catch(error){
        console.log(error)
        throw new Error('Failed to fetch user data');
    }
}

export default authUser;