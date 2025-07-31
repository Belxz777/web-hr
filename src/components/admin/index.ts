


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
  id: number
  name: string
  surname: string
  patronymic: string
  login: string
  job: string
  department: number
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
