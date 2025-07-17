"use server"

import { cookies } from 'next/headers';
import { host } from '@/types';

interface AuthResponse {
  user: {
    employeeId: number
    firstName: string
    lastName: string
    position: number
  }
  job: {
    jobName: string
    deputy: number
  }
  department: string
  deputy: {
    deputyId: number
    deputyName: string
    compulsory: boolean
  }[]
}

export default async function authUser(): Promise<AuthResponse> {
  const cookieStore = cookies();
  const jwt = cookieStore.get('cf-auth-id')?.value;
  
  if (!jwt) {
    throw new Error('Authentication token not found');
  }

  try {
    const response = await fetch(`${host}users/get_user`, {
      credentials: 'include',
      headers: {
        Cookie: `jwt=${jwt}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 0 } // Отключаем кэширование
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch user data');
    }

    return await response.json();
  } catch (error) {
    console.error('Authentication error:', error);
    throw error instanceof Error ? error : new Error('Authentication failed');
  }
}