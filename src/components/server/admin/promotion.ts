"use server"

import { cookies } from "next/headers";
import { changePass, host } from "@/types";

interface dd {
    empid: number;
    position: number;
}
interface head {
    empid: number;
    department: number;
}
async function promotion(empl: dd): Promise<any> {
    
    const cookieStore = cookies();
    const jwt = cookieStore.get('cf-auth-id')?.value;
    if (!jwt) {
        throw new Error('Токен не предоставлен');
    }
    try {
        const response = await fetch(`${host}users/deposition/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `jwt=${jwt}`
            },
            body: JSON.stringify(empl)
        });
        return response.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}
async function makehead(empl: head): Promise<any> {
    
    const cookieStore = cookies();
    const jwt = cookieStore.get('cf-auth-id')?.value;
    if (!jwt) {
        throw new Error('Токен не предоставлен');
    }
    try {
        const response = await fetch(`${host}entities/department/?id=${empl.department}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `jwt=${jwt}`
            },
            body: JSON.stringify({
                headId: empl.empid
                })
        });
        return response.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}



export {promotion,makehead};
