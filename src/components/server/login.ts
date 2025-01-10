"use server"
import { host } from '@/types';
import { cookies} from 'next/headers';

 interface LoginData {
    login: string
    password: string
}
   async function sendUserLoginData(data: LoginData){
    const res = await fetch(`${host}users/login`, {
        method: 'POST',
        credentials: 'include', 
        headers: {
            'Content-Type': 'application/json'
        },
    body: JSON.stringify(data)
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error(`Ошибка при входе попробуйте еще раз , статус ${res.statusText} `,); 
    }
    const receiveddata = await res.json();
    const cookiesApi = cookies()

    cookiesApi.set('jwt', receiveddata.token,{
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        httpOnly: true,
        secure: true,
    })
    return receiveddata
}

export default sendUserLoginData;