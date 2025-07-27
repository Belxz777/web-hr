import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Пути, требующие проверки позиции
const POSITION_PROTECTED_PATHS = [
  '/cr',
  '/cr/*',
  '/mydepartment',
  '/mydepartment/*',

];

// Минимальная требуемая позиция для доступа
const MIN_POSITION = 2;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get('cf-auth-id');

  // 1. Проверка авторизации для защищённых путей
  if (!authCookie) {
    const protectedPaths = [
      '/profile',
      '/changePass',
      '/report',
      '/department',
      ...POSITION_PROTECTED_PATHS,
    ];

    if (protectedPaths.some(path => pathname.startsWith(path.replace('/*', '')))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // 2. Проверка позиции для специальных путей
  if (POSITION_PROTECTED_PATHS.some(path => pathname.startsWith(path.replace('/*', '')))) {
    try {
      // Делаем запрос к нашему API эндпоинту
      const authCheck = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check`, {
        headers: {
          Cookie: `cf-auth-id=${authCookie.value}`,
        },
      });

      if (!authCheck.ok) {
        throw new Error('Ошибка проверки прав');
      }

      const { userData }: { userData: { position: number } } = await authCheck.json();

      // Проверяем позицию пользователя
      if (userData.position < MIN_POSITION) {
        return NextResponse.redirect(new URL('/profile', request.url));
      }

      // Добавляем данные пользователя в заголовки для использования в приложении
      const response = NextResponse.next();
      response.headers.set('x-user-position', userData.position.toString());
      // В middleware, после успешной проверки
      response.cookies.set('user-position', userData.position.toString(), {
      maxAge: 60 * 15, // 15 минут
       httpOnly: true,
      });
      return response;

    } catch (error) {
      console.error('Middleware auth error:', error);
      return NextResponse.redirect(new URL('/profile', request.url));
    }
  }
 if (pathname === "/login" || pathname==="/register") {
      return NextResponse.redirect(new URL("/profile", request.url));
    } 
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/profile',
    '/profile/:path*',
    '/cr',
    '/cr/:path*',
    '/mydepartment',
    '/mydepartment/:path*',
    '/changePass',
    '/report',
    '/department',
  ],
};