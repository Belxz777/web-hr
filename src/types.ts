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
// const host ="https://projects.bell-x.ru/pulse/";
const host = "http://127.0.0.1:8000/api/v1/"
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

type EmployeeSummary = {
  employee: {
    employee_id: string;
    employee_name: string;
    employee_patronymic: string;
    employee_surname: string;
  };
  summary: {
    total_hours: number;
    function_hours: number;
    deputy_hours: number;
    compulsory_hours: number;
    non_compulsory_hours: number;
  };
  reports: Array<{
    laborCostId: number;
    departmentId: number;
    function: number | null;
    deputy: number | null;
    compulsory: boolean;
    worked_hours: number;
    comment: string;
    date: string;
  }>;
  reports_count: number;
  query_params: {
    date: string;
    start_date: string | null;
    end_date: string | null;
  };
};

type EmployeeDistribution = {
  employee: {
    employee_id: string;
    employee_name: string;
    employee_surname: string;
    employee_patronymic: string;
  };
  time_period: {
    type: string;
    date: string;
    start_date: string | null;
    end_date: string | null;
    days_count: number;
  };
  total_hours: number;
  total_entries: number;
  distribution: {
    by_category: {
      compulsory: { hours: number; percent: number };
      free: { hours: number; percent: number };
      functions: { hours: number; percent: number };
      deputies: { hours: number; percent: number };
      typical: { hours: number; percent: number };
      non_typical: { hours: number; percent: number };
    };
    by_functions: {
      typical: Array<{
        function_id: number;
        function_name: string;
        hours: number;
        percent: number;
        entries_count: number;
      }>;
      non_typical: Array<{
        function_id: number;
        function_name: string;
        hours: number;
        percent: number;
        entries_count: number;
      }>;
    };
    extra: Array<{
      type: string;
      deputy_id: number;
      deputy_name: string;
      hours: number;
      percent: number;
      entries_count: number;
    }>;
    by_department: Array<{
      department_id: number;
      department_name: string;
      hours: number;
      percent: number;
    }>;
  };
  performance_metrics: {
    avg_hours_per_day: number;
    avg_hours_per_reports: number;
  };
};

type EmployeeInfo = {
  employeeId: number
  firstName: string
  lastName: string
  patronymic: string
  login: string
  password: string
  jobid: number
  departmentid: number
  position: number
}


type TimePeriod = {
  type: string;
  date: string;
  start_date: string | null;
  end_date: string | null;
};

type DepartmentStats = {
  total_hours: number;
  function_hours: number;
  deputy_hours: number;
  employee_count: number;
};

type EmployeeStats = Array<any>;

type DepartmentForStats = {
  department_id: number;
  department_name: string;
  time_period: TimePeriod;
  department_stats: DepartmentStats;
  employee_stats: EmployeeStats;
};

type DepartmentsData = {
  departments: DepartmentForStats[];
  total_departments: number;
};

export { host };
export type {
  department,
  EmployeeInfo,
  DepartmentStats,
  EmployeeStats,
  DepartmentForStats,
  DepartmentsData,
  TimePeriod,
  EmployeeDistribution,
  EmployeeSummary,
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
