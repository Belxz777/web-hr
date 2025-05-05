interface department {
  id: number;
  name: string;
  head: number;
}
interface report {
  func_id?: number;
  deputy_id?: number | null;  
  workingHours: number;
  comment: string;
}

interface TFData {
  nonCompulsory: {
    deputyId: number;
    deputyName: string;
  };
  functions: {
    funcName: string;
  };

}
interface Department {
  departmentId: string;
  departmentName: string;
}
interface Job {
  jobId: string;
  jobName: string;
  tfs: number[];
}
interface defaultTF {
  tfName: string;
  tfDescription: string;
  time: number;
  isMain: boolean;
}
interface createUser {
  job_title_id: number;
  age: number;
  first_name: string;
  last_name: string;
  father_name: string;
  login: string;
  password: string;
  department_id: number;
}
interface jobTitle {
  id: number;
  name: string;
}
type Employee = {
  employeeId: number;
  firstName: string;
  lastName: string;
  position: string;
  currentLevel?: number;
};
interface task {
  taskId: number;
  taskName: string;
  taskDescription: string;
  status: string;
  hourstodo: number;
  closeDate: null;
  isExpired: boolean;
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
// type employee = {
//   completedTasks: null;
//   departmentid: number;
//   employeeId: number;
//   expiredTasksCount: null;
//   firstName: string;
//   jobid: number;
//   lastName: string;
//   patronymic: string;
//   position:number;
//   tasksCount: null;
// };
type Deputy = {
  deputyId: number;
  deputyName: string;
  compulsory: boolean;
};
type employee = {
  deputy: Deputy[];
  job: {
    deputy: number;
    jobName: string;
  };
  user: {
    employeeId: number;
    firstName: string;
    lastName: string;
    jobid: number;
    position: number;
    departmentid: number;
  };
};

interface changePass {
  old_password: string;
  new_password: string;
}
const host ="https://projects.bell-x.ru/pulse/";
// const host = "http://127.0.0.1:8000/api/v1/"
interface statusType {
  code: string | number;
  text: string;
}

// desh

type DepartmentStatsProps = {
  data: {
    total_hours: number;
    function_hours: number;
    deputy_hours: number;
    employee_count: number;
  };
};
type EmployeeStatsProps = {
  deputy_hours: number;
  employee_id: number;
  function_hours: number;
  total_hours: number;
};

interface StatCardProps {
  title: string;
  value: number | string;
  unit?: string;
  percent?: string;
  color?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

type DailyStats = {
  department_id: number;
  employee_stats: EmployeeStatsProps[];
  time_period: {
    date: string;
    end_date: string;
    start_date: string;
    type: string;
  };

  department_stats: {
    total_hours: number;
    function_hours: number;
    deputy_hours: number;
    employee_count: number;
  };
};

interface CircularProgressProps {
  percentage: number;
  color: string;
  size?: "sm" | "md" | "lg";
  strokeWidth?: number;
  children?: React.ReactNode;
}

export { host };
export type {
  department,
  createUser,
  DailyStats,
  Job,
  report,
  Department,
  defaultTF,
  Employee,
  jobTitle,
  task,
  changePass,
  statusType,
  employee,
  Deputy,
  TFData,
  DepartmentStatsProps,
  CircularProgressProps,
  StatCardProps,
};
