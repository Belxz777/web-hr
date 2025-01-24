import { cookieget } from "@/components/server/cookie"

export const useCookieGet = () => {
    const cookie = cookieget()
    return cookie
        }