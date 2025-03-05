"use server"
import { host } from '@/types';
import { cookies } from 'next/headers';


interface TaskData {
    forEmployeeId: number,
    hourstodo: number,
    taskName: string,
}
async function createTaskData(data: TaskData) {
    const cookieStore = cookies();
        const jwt = cookieStore.get('cf-auth-id')?.value
        if(!jwt){
            throw new Error('No token provided')
        }
    const res = await fetch(`${host}entities/task/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `jwt=${jwt}`
        },
        body: JSON.stringify(data)
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error(`Ошибка при создании задачи, попробуйте еще раз , статус ${res.statusText}`,);
    }
    const receiveddata = await res.json();

    return receiveddata
}

export default createTaskData;

