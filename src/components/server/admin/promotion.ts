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
interface PromotionData {
    id: number;
    position: number;
}

async function promotion(data: PromotionData): Promise<{ 
    message: string; 
    error?: string 
}> {
    const cookieStore = cookies();
    const jwt = cookieStore.get('cf-auth-id')?.value;
    
    if (!jwt) {
        return { 
            message: 'Ошибка', 
            error: 'Требуется аутентификация' 
        };
    }

    try {
        const response = await fetch(`${host}users/deposition`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `jwt=${jwt}`
            },
            body: JSON.stringify({
                id: data.id,
                position: data.position
            }),
            credentials: 'include'
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                message: 'Ошибка',
                error: result.message || 'Неизвестная ошибка сервера'
            };
        }

        return result;
    } catch (error) {
        console.error('Promotion error:', error);
        return {
            message: 'Ошибка',
            error: 'Ошибка сети или сервера'
        };
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
