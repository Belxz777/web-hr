import {urlenv }from "./config";
export interface Department {
  id: number
  name: string
  description?: string
  jobs_list?: number[]
}
interface report {
  function_id:number, 
  hours_worked: number;
  comment?: string;
}
// interface TFData {
//   nonCompulsory: {
//     deputyId: number;
//     deputyName: string;
//   };
//   functions: {
//     funcName: string;
//   };

// }
export interface FunctionItem {
  id:number,
  name: string,
  description:string,
  is_main:boolean
}
export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  error?: string;
}
interface Job {
  id: number;
  name: string;
  pre_positioned:number;
}




type employee = {
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

export interface adminPassChange {
  admin_password:string;
  user_id:number,
  new_password:string;

}
const host = urlenv
interface statusType {
  code: string | number;
  text: string;
}

interface errorResponse {
  message:string
}

// desh

type DepartmentStatsProps = {
  data: {
    total_hours: number;
    function_hours: number;
    deputy_hours: number;
    employee_count: number;
  };
  title: string;
};
type EmployeeStatsProps = {
  first_name: string;
  last_name: string;
  patronymic: string;
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
interface DepartmentDistribution {
  department_id: string;
  department_name: string;
  time_period: {
    type: string;
    date: string;
    start_date: string | null;
    end_date: string | null;
  };
  total_hours: number;
  total_entries: number;
  distribution: {
    by_type: {
      functions: {
        hours: number;
        percent: number;
      };
      deputies: {
        hours: number;
        percent: number;
      };
      compulsory: {
        hours: number;
        percent: number;
      };
      non_compulsory: {
        hours: number;
        percent: number;
      };
      typical: {
        hours: number;
        percent: number;
      };
      non_typical: {
        hours: number;
        percent: number;
      };
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
    by_deputies: Array<{
      deputy_id: number;
      deputy_name: string;
      hours: number;
      percent: number;
      reports_count: number;
    }>;
  };
}
 interface EmployeeSummary {
  employee: {
    employee_id: string
    employee_name: string
    employee_surname: string
    employee_patronymic: string
    job_title: string
  }
  summary: {
    total_hours: number
    function_hours: number
    deputy_hours: number
    compulsory_hours: number
    non_compulsory_hours: number
  }
  reports: Array<{
    laborCostId: number
    department: number
    function__funcName: string | null
    deputy__deputyName: string | null
    compulsory: boolean
    worked_hours: number
    comment: string
    date: string
  }>
  reports_count: number
  query_params: {
    date: string | null
    start_date: string | null
    end_date: string | null
  }
  daily_summary?: Array<any>
}

interface EmployeeDistribution {
  employee: {
    employee_id: string
    employee_name: string
    employee_surname: string
    employee_patronymic: string
  }
  time_period: {
    type: string
    date: string | null
    start_date: string | null
    end_date: string | null
  }
  total_hours: number
  total_reports: number
  distribution: {
    by_functions: {
      typical: Array<{
        function_id: number
        function_name: string
        hours: number
        percent: number
        entries_count: number
      }>
      non_typical: Array<{
        function_id: number
        function_name: string
        hours: number
        percent: number
        entries_count: number
      }>
    }
    extra: Array<{
      type: string
      deputy_id: number
      deputy_name: string
      hours: number
      percent: number
      entries_count: number
    }>
  }
  query_params: {
    date: string | null
    start_date: string | null
    end_date: string | null
  }
}

type EmployeeInfo = {
  employeeId: number
  firstName: string
  lastName: string
  code:number
  patronymic: string
  login: string
  password: string
  jobid: number
  departmentid: number
  position: number
}
type employeeprofile = {
  employeeId: number;
  firstName: string;
  code: number;
  lastName: string;
  position: number;
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

type BackendStatus = {
  is_running: boolean
  uptime: number
  memory_usage: number
  cpu_usage: number
  active_connections: number
  last_updated: string
}
export interface Toast {
  id: string
  message: string
  type: "info" | "error"
  duration?: number
}

export interface ToastOptions {
  duration?: number
}


export { host };
declare global {
  interface Window {
    toast: {
      info: (message: string, options?: { duration?: number  }) => string
      error: (message: string, options?: { duration?: number }) => string
    }
  }
}
export type {
  BackendStatus,
  EmployeeInfo,
  DepartmentStats,
  EmployeeStats,
  DepartmentForStats,
  DepartmentsData,
  TimePeriod,
  EmployeeDistribution,
  EmployeeSummary,
  DailyStats,
  Job,
  report,
  changePass,
  statusType,
  employee,
  employeeprofile,

  DepartmentStatsProps,
  CircularProgressProps,
  StatCardProps,

  DepartmentDistribution,

};
