"use server";

import { host } from "@/types";
import { cookies } from "next/headers";

interface DepartmentData {
  name: string;
  description: string;
  jobs_list?: number[];
}

interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  error?: string;
}

async function createDepartment(departmentData: DepartmentData): Promise<{ 
  message: string, 
  data?: any 
} | ErrorResponse> {
  try {
    const jwt = cookies().get('cf-auth-id')?.value;
    if (!jwt) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${host}entities/department/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `jwt=${jwt}`
      },
      body: JSON.stringify(departmentData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        message: data.message || 'Ошибки валидации',
        errors: data.errors || undefined,
        error: response.status === 403 ? 'Forbidden' : undefined
      };
    }

    return {
      message: 'Отдел успешно создан',
      data: data.data
    };

  } catch (error) {
    console.error('Department creation error:', error);
    return {
      message: error instanceof Error ? error.message : 'Внутренняя ошибка сервера',
      error: 'Internal Server Error'
    };
  }
}

async function deleteDepartment(depId: number): Promise<{ 
  message: string 
} | ErrorResponse> {
  try {
    const jwt = cookies().get('cf-auth-id')?.value;
    if (!jwt) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${host}entities/department/?id=${depId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `jwt=${jwt}`
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        message: data.message || 'Ошибка удаления отдела',
        error: response.status === 403 ? 'Forbidden' : data.error
      };
    }

    return { message: 'Отдел успешно удален' };

  } catch (error) {
    console.error('Department deletion error:', error);
    return {
      message: error instanceof Error ? error.message : 'Внутренняя ошибка сервера',
      error: 'Internal Server Error'
    };
  }
}

async function updateDepartment(
  depId: number,
  updateData: Partial<DepartmentData>
): Promise<{ 
  message: string,
  data?: any 
} | ErrorResponse> {
  try {
    const jwt = cookies().get('cf-auth-id')?.value;
    if (!jwt) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${host}entities/department/?id=${depId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `jwt=${jwt}`
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        message: data.message || 'Ошибка обновления отдела',
        errors: data.errors || undefined
      };
    }

    return {
      message: 'Отдел успешно обновлен',
      data: data.data
    };

  } catch (error) {
    console.error('Department update error:', error);
    return {
      message: error instanceof Error ? error.message : 'Внутренняя ошибка сервера',
      error: 'Internal Server Error'
    };
  }
}

async function getDepartment(depId?: number): Promise<{ 
  message: string,
  data: any,
  count?: number 
} | ErrorResponse> {
  try {


    const url = depId 
      ? `${host}entities/department/?id=${depId}`
      : `${host}entities/department/`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        message: data.message || 'Ошибка получения данных отдела',
        error: data.error
      };
    }

    return data;

  } catch (error) {
    console.error('Department retrieval error:', error);
    return {
      message: error instanceof Error ? error.message : 'Внутренняя ошибка сервера',
      error: 'Internal Server Error'
    };
  }
}

export { createDepartment, deleteDepartment, updateDepartment, getDepartment };
