'use server'
import { cookies } from "next/headers";
import { host, jobTitle } from "@/types";

async function fetchTitle(id:number):Promise<string> {
    if(!id ){
        return "no id provided"
    }
    const res = await fetch(`${host}entities/job/${id}`);
    if(!res.ok) {
        console.log(res.status)
        throw new Error('Failed to fetch data')

    }
    const receiveddata = await res.json();
    return receiveddata.jobName;
}
async function fetchAllTitles():Promise<jobTitle[]> {
    const res = await fetch(`${host}/entities/jobs/`,);
    if(!res.ok) {
        console.log(res.status)
        throw new Error('Failed to fetch data')

    }
    const receiveddata = await res.json();
    return receiveddata
}

export  {fetchTitle,fetchAllTitles};