"use server"
import { cookies } from 'next/headers';
import { host } from '@/types';
interface Deputy {
    deputyId: number
    deputyName: string
    compulsory: boolean
}

interface Job {
    jobName: string
    deputy: number
}

interface User {
    employeeId: number
    firstName: string
    lastName: string
    position: number
}

interface AuthResponse {
    user: User
    job: Job,
    department: string,
    deputy: Deputy[]
}

async function authUser(): Promise<AuthResponse> {
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