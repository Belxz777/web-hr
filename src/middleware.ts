
import { NextResponse } from 'next/server';

export function middleware(request: { cookies: { get: (arg0: string) => any; }; nextUrl: { pathname: any; }; url: string | URL | undefined; }) {
  const token = request.cookies.get('jwt'); // Получаем токен из cookies

  // Проверяем, на какую страницу пытается зайти пользователь
  const { pathname } = request.nextUrl;

  // Логика для аутентифицированных пользователей
  if (token) {
    // Если пользователь аутентифицирован и пытается зайти на страницы входа или регистрации
    if (pathname === '/login' || pathname === '/register') {
      return NextResponse.redirect(new URL('/profile', request.url)); // Перенаправляем на главную страницу
    }
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/profile', request.url)); // Перенаправляем на страницу профиля
      }
  } else {
    // Логика для неаутентифицированных пользователей
    // Если пользователь не аутентифицирован и пытается зайти на защищенные страницы
    const protectedPaths = [ '/profile','/changePass','/report','/department']; // Замените на ваши защищенные пути

    if (protectedPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/login', request.url)); // Перенаправляем на страницу входа
    }
  }

  // Если ни одно условие не сработало, продолжаем обработку запроса
  return NextResponse.next();
}

// Указываем, для каких путей применять middleware
export const config = {
  matcher: ['/login', '/register', '/dashboard', '/profile'], // Укажите все пути, которые нужно обрабатывать
};
