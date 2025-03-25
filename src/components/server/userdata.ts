'use server'
import { host, task } from "@/types";
import { cookies } from "next/headers";

async function userTasks():Promise<Array<task> | task | number> {
    const cookieStore = cookies();
    const jwt = cookieStore.get('cf-auth-id')?.value
    if(!jwt){
        throw new Error('No token provided')
    }
    const res = await (await fetch(`${host}entities/user/tasks/`, {
        credentials: 'include',
        headers: {
            Cookie: `jwt=${jwt}`
        }
    }))
    if(!res.ok) {
        console.log(res.status)
        return res.status
    }
    const data = await res.json();
    return data
}
async function userTaskstoReport():Promise<Array<task> | task | []> {
    const cookieStore = cookies();
    const jwt = cookieStore.get('cf-auth-id')?.value
    if(!jwt){
        throw new Error('No token provided')
    }//http://127.0.0.1:8000/api/v1/fill/progress/
    const res = await (await fetch(`${host}entities/user/tasks/reported/`, {
        credentials: 'include',  
        headers: {
            Cookie: `jwt=${jwt}`
        }
    }))
    if(!res.ok) {
        console.log(res.status)
        throw new Error('No token provided')
    }
    const data = await res.json();
    return data
}
async function  deleteUser(id:number) {

    const res = await (await fetch(`${host}users/delete/${id}`, {
        credentials: 'include',  
method:"DELETE"
    }))
    if(!res.ok) {
        console.log(res.status)
        throw new Error('ERR')
    }
    const data = await res.json();
    return data
    
}
export {userTasks,userTaskstoReport,deleteUser}