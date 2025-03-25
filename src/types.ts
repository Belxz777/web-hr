
interface department {
    id:number,
    name:string,
    head:number
  }
interface report {
  taskId: number,
  workingHours: number,  
  comment: string,

}
  interface createUser {
    job_title_id: number,
    age: number,
    first_name: string,
    last_name: string,
    father_name: string,
    login:string,
    password:string,
    department_id:number
}
interface jobTitle {
    id:number,
    name:string
}
interface task {
  taskId: number,
      taskName: string,
      taskDescription: string,
      status: string,
      hourstodo: number,
      closeDate: null,
      isExpired: boolean
    //   {
    //     "taskId": 4,
    //     "taskName": "Описание необходимого комп решения",
    //     "forEmployeeId": 1,
    //     "status": "completed",
    //     "hourstodo": "-2.00",
    //     "been": true,
    //     "taskDescription": "Задача на 1 раб день",
    //     "fromDate": "2024-12-21T15:54:18.811568+04:00",
    //     "closeDate": null,
    //     "isExpired": false
    // },
  }
type employee = {
    completedTasks: null;
    departmentid: number;
    employeeId: number;
    expiredTasksCount: null;
    firstName: string;
    jobid: number;
    lastName: string;
    patronymic: string;
    position:number;
    tasksCount: null;
};

  interface changePass {
    old_password:string,
    new_password:string
  }
  const host = process.env.BACKEND_URL || "http://127.0.0.1:8000/api/v1/"


  interface statusType {
    code:string | number,
  text:string
  }
  
  export { host }
  export type { department, createUser,report, jobTitle, task, changePass, statusType,employee }
  