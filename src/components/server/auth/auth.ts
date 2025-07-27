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
  AUTH_FAILED: 'Authentication failed'
};

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};

export default async function authUser(): Promise<AuthResponse> {
  // 1. Быстрое получение куки
  const jwt = cookies().get('cf-auth-id')?.value;
  if (!jwt) throw new Error(AUTH_ERRORS.NO_TOKEN);

  try {
    // 2. Оптимизированный запрос с таймаутом
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // Таймаут 5 сек

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

    // 3. Быстрая проверка ответа
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(errorText || AUTH_ERRORS.FETCH_FAILED);
    }

    // 4. Оптимизированный парсинг JSON
    return await response.json();

  } catch (error) {
    console.error('Authentication error:', error);
    throw error instanceof Error ? error : new Error(AUTH_ERRORS.AUTH_FAILED);
  }
}