"use server"

import { cookies } from 'next/headers';
import { host } from '@/types';

interface AuthResponse {
  user: {
    employeeId: number;
    firstName: string;
    lastName: string;
    position: number;
  };
  job: {
    jobName: string;
    deputy: number;
  };
  department: string;
  deputy: {
    deputyId: number;
    deputyName: string;
    compulsory: boolean;
  }[];
}

const AUTH_ERRORS = {
  NO_TOKEN: 'Authentication token not found',
  FETCH_FAILED: 'Failed to fetch user data',
  AUTH_FAILED: 'Authentication failed',
  TOKEN_EXPIRED: 'Token expired'
};

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};

export default async function authUser(): Promise<AuthResponse> {
  const cookieStore = cookies();
  const jwt = cookieStore.get('cf-auth-id')?.value;
  
  if (!jwt) throw new Error(AUTH_ERRORS.NO_TOKEN);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${host}users/get_user`, {
      credentials: 'include',
      headers: {
        ...DEFAULT_HEADERS,
        Cookie: `jwt=${jwt}`
      },
      signal: controller.signal,
      next: { revalidate: 0 }
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      // Удаляем куку если получили 401 Unauthorized
      cookieStore.delete('cf-auth-id');
      throw new Error(AUTH_ERRORS.TOKEN_EXPIRED);
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(errorText || AUTH_ERRORS.FETCH_FAILED);
    }

    return await response.json();

  } catch (error) {
    console.error('Authentication error:', error);
    
    // Дополнительная проверка для других случаев 401 ошибки
    if (error instanceof Error && error.message.includes('401')) {
      cookies().delete('cf-auth-id');
      throw new Error(AUTH_ERRORS.TOKEN_EXPIRED);
    }
    
    throw error instanceof Error ? error : new Error(AUTH_ERRORS.AUTH_FAILED);
  }
}