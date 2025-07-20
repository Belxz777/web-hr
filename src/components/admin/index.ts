export interface Department {
  departmentId: number
  departmentName: string
  departmentDescription?: string
  jobsList?: number[]
  tfs?: number[]
}

export interface Job {
  jobId: number
  jobName: string
  deputy: number
}

export interface Deputy {
  deputyId: number
  deputyName: string
  deputyDescription?: string | null
  compulsory?: boolean
  deputy_functions: Functions[]
}

export interface Functions {
  funcId: number
  funcName: string
  consistent?: number
}

export interface Employee {
  employeeId: number
  firstName: string
  lastName: string
  patronymic: string
  login: string
  jobid: string
  departmentid: number
  email?: string
  position: number
}

export type ViewState =
  | "main"
  | "select_department"
  | "create_department"
  | "create_deputy"
  | "department_management"
  | "create_job"
  | "edit_job"
  | "manage_deputy"
  | "edit_department"
  | "delete_department"
  | "edit_deputy"
  | "delete_deputy"
  | "delete_job"
  | "create_function"
  | "delete_function"
| "promotions"
