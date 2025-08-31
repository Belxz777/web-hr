"use server"

import { cookies } from 'next/headers';
import { employeeprofile, host } from '@/types';


interface JobData {
  jobName: string;
}

interface AuthResponse {
  message: string;
  data: {
    user: employeeprofile;
    department: string;
    job: JobData;
    deputy?: {
      deputyId: number;
      deputyName: string;
      compulsory: boolean;
    }[];
  };
}

enum AuthError {
  NO_TOKEN = 'Authentication token not found',
  FETCH_FAILED = 'Failed to fetch user data',
  AUTH_FAILED = 'Authentication failed',
  TOKEN_EXPIRED = 'Token expired',
  NETWORK_ERROR = 'Network request failed',
  TIMEOUT = 'Request timed out',
  INVALID_DATA = 'Received invalid user data structure'
}

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};

const REQUEST_TIMEOUT = 5000;

export default async function authUser(): Promise<AuthResponse['data']> {
  const cookieStore = cookies();
  const jwt = cookieStore.get('cf-auth-id')?.value;
  
  if (!jwt) {
    throw new Error(AuthError.NO_TOKEN);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

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
      cookieStore.delete('cf-auth-id');
      throw new Error(AuthError.TOKEN_EXPIRED);
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => AuthError.FETCH_FAILED);
      throw new Error(errorText);
    }

    const data: AuthResponse = await response.json();

    // Validate response structure
    if (!data?.data?.user || !data.data.department || !data.data.job) {
      throw new Error(AuthError.INVALID_DATA);
    }

    return data.data;

  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(AuthError.TIMEOUT);
      }
      if (error.message.includes('401')) {
        cookieStore.delete('cf-auth-id');
        throw new Error(AuthError.TOKEN_EXPIRED);
      }
    }

    throw new Error(AuthError.AUTH_FAILED);
  }
}