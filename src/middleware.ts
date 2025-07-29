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