import { host } from '@/types';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export interface AuthCheckResponse {
  message: string;
  userData: {
    user: number;
    exp: number;
    iat: number;
    position: number;
  };
}

export async function GET() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('cf-auth-id');

  if (!authCookie?.value) {
    return NextResponse.json(
      { error: 'Требуется авторизация' },
      { status: 401 }
    );
  }

  try {
    // Отправляем запрос к вашему бэкенду
    const backendResponse = await fetch(`${host}auth/check`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `cf-auth-id=${authCookie.value}`,
      },
      credentials: 'include',
    });

    if (!backendResponse.ok) {
      throw new Error('Ошибка проверки авторизации');
    }

    const data: AuthCheckResponse = await backendResponse.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при проверке авторизации' },
      { status: 500 }
    );
  }
}