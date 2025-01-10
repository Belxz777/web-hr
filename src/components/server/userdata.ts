'use server'
import { host, task } from "@/types";
import { cookies } from "next/headers";

async function userTasks():Promise<Array<task> | task> {
    const cookieStore = cookies();
    const jwt = cookieStore.get('jwt')?.value
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
    }
    const data = await res.json();
    return data
}
async function userTaskstoReport():Promise<Array<task> | task> {
    const cookieStore = cookies();
    const jwt = cookieStore.get('jwt')?.value
    if(!jwt){
        throw new Error('No token provided')
    }
    const res = await (await fetch(`${host}entities/user/tasks/reported/`, {
        credentials: 'include',
        headers: {
            Cookie: `jwt=${jwt}`
        }
    }))
    if(!res.ok) {
        console.log(res.status)
    }
    const data = await res.json();
    return data
}
export {userTasks,userTaskstoReport}