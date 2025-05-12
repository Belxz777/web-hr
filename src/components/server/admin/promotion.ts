"use server"

import { cookies } from "next/headers";
import { changePass, host } from "@/types";

interface dd {
    empid: any;
    position: number;
}

async function promotion(empl: dd): Promise<any> {
    
    const cookieStore = cookies();
    const jwt = cookieStore.get('cf-auth-id')?.value;
    if (!jwt) {
        throw new Error('No token provided');
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

export default promotion;
