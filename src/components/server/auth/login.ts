"use server"
import { getExpiresDate } from '@/components/utils/format';
import { host } from '@/types';
import { cookies} from 'next/headers';

 interface LoginData {
    login: string
    password: string,
}
   async function sendUserLoginData(data: LoginData){
    try{
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
        throw new Error(`Ошибка при входе попробуйте еще раз , статус ${res.statusText} |
            попытка входа под логином ${data.login} `); 
    }
    const receiveddata = await res.json();
    const cookiesApi = cookies()
    let expiration = getExpiresDate(receiveddata.time) || new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    cookiesApi.set('cf-auth-id', receiveddata.token,{
        expires: expiration,
        httpOnly: true,

    })

    

    return receiveddata
}
catch(e){
    console.log(e)
    throw new Error(`Ошибка при входе попробуйте еще раз`)
}

}

export default sendUserLoginData;