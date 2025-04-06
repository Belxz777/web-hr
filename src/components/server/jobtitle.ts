'use server'
import { cookies } from "next/headers";
import { host, jobTitle } from "@/types";

async function fetchTitle(id:number):Promise<string> {
    if(!id ){
        return "no id provided"
    }
    try{
    const res = await fetch(`${host}entities/job/?id=${id}`);
    if(!res.ok) {
        console.log(res.status)
        throw new Error('Failed to fetch data')

    }
    const receiveddata = await res.json();
    return receiveddata.jobName;
}
catch(e){
    console.log(e)
    return "error"
}
}
async function fetchAllTitles():Promise<jobTitle[]> {
    try{
    const res = await fetch(`${host}/entities/jobs/`,);
    if(!res.ok) {
        console.log(res.status)
        throw new Error('Failed to fetch data')

    }
    const receiveddata = await res.json();
    return receiveddata
}
catch(e){
    console.log(e)
    return []
}
}

export  {fetchTitle,fetchAllTitles};