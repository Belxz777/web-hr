"use server"

import { cookies } from "next/headers";
import { changePass, host } from "@/types";

async function changePassword(passwordData:changePass): Promise<any> {
    if (!passwordData) {
        throw new Error('Password data is required');
    }
    const cookieStore = cookies();
    const jwt = cookieStore.get('cf-auth-id')?.value;
    if (!jwt) {
        throw new Error('No token provided');
    }
    try{
    const response = await fetch(`${host}users/change_password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
             Cookie: `jwt=${jwt}`
        },
        body: JSON.stringify(passwordData)
    });
    console.log(response)
    return response.json();
}
catch (err) { 
    console.error(err);
    throw err;
}
}

export default changePassword;