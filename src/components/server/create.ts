"use server"
import { host } from '@/types';


interface TaskData {
    forEmployeeId: number,
    hourstodo: number,
    taskName: string,
}
async function createTaskData(data: TaskData) {
    const res = await fetch(`${host}entities/task/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
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