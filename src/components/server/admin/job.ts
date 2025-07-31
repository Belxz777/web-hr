"use server";

import { host } from "@/types";
import { cookies } from "next/headers";

interface JobData {
  name: string;
  pre_positioned?:number;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  error?: string;
}

async function getAllJobs(): Promise<{
  message: string;
  data: any[];
} | ErrorResponse> {
  try {

    const response = await fetch(`${host}entities/job/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
// { Пример успешного ответа
//     "message": "Список должностей",
//     "data": [
//         {
//             "id": 1,
//             "name": "Пуговкин2.0",
//             "pre_positioned": 1
//         },
//         {
//             "id": 3,
//             "name": "Пуговкин Дир",
//             "pre_positioned": 5
//         },
//         {
//             "id": 4,
//             "name": "Пуговкин Дирss",
//             "pre_positioned": 5
//         }
//     ]
// }
    if (!response.ok) {
      return {
        message: data.message || 'Ошибка получения списка должностей',
        error: data.error
      };
    }

    return data;

  } catch (error) {
    console.error('Job retrieval error:', error);
    return {
      message: error instanceof Error ? error.message : 'Внутренняя ошибка сервера',
      error: 'Internal Server Error'
    };
  }
}

async function getJob(id: number): Promise<{
  message: string;
  data: any;
} | ErrorResponse> {
  try {
    const jwt = cookies().get('cf-auth-id')?.value;
    if (!jwt) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${host}entities/job/?id=${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `jwt=${jwt}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        return {
          message: 'Должность не найдена',
          error: 'Not Found'
        };
      }
      return {
        message: data.message || 'Ошибка получения данных должности',
        error: data.error
      };
    }

    return data;

  } catch (error) {
    console.error('Job retrieval error:', error);
    return {
      message: error instanceof Error ? error.message : 'Внутренняя ошибка сервера',
      error: 'Internal Server Error'
    };
  }
}

async function createJob(jobData: JobData): Promise<{
  message: string;
  data: any;
} | ErrorResponse> {
  try {
    const jwt = cookies().get('cf-auth-id')?.value;
    if (!jwt) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${host}entities/job/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `jwt=${jwt}`
      },
      body: JSON.stringify(jobData),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 400) {
        return {
          message: 'Ошибки валидации',
          errors: data.errors
        };
      }
      return {
        message: data.message || 'Ошибка создания должности',
        error: data.error
      };
    }

    return {
      message: 'Должность успешно создана',
      data: data.data
    };

  } catch (error) {
    console.error('Job creation error:', error);
    return {
      message: error instanceof Error ? error.message : 'Внутренняя ошибка сервера',
      error: 'Internal Server Error'
    };
  }
}

async function updateJob(
  id: number,
  updateData: Partial<JobData>
): Promise<{
  message: string;
  data?: any;
} | ErrorResponse> {
  try {
    const jwt = cookies().get('cf-auth-id')?.value;
    if (!jwt) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${host}entities/job/?id=${id}`, {
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
      if (response.status === 400) {
        return {
          message: 'Ошибки валидации',
          errors: data.errors
        };
      }
      if (response.status === 404) {
        return {
          message: 'Должность не найдена',
          error: 'Not Found'
        };
      }
      return {
        message: data.message || 'Ошибка обновления должности',
        error: data.error
      };
    }

    return {
      message: 'Должность успешно обновлена',
      data: data.data
    };

  } catch (error) {
    console.error('Job update error:', error);
    return {
      message: error instanceof Error ? error.message : 'Внутренняя ошибка сервера',
      error: 'Internal Server Error'
    };
  }
}

async function deleteJob(id: number): Promise<{
  message: string;
} | ErrorResponse> {
  try {
    const jwt = cookies().get('cf-auth-id')?.value;
    if (!jwt) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${host}entities/job/?id=${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `jwt=${jwt}`
      },
    });

    if (!response.ok) {
      const data = await response.json();
      if (response.status === 404) {
        return {
          message: 'Должность не найдена',
          error: 'Not Found'
        };
      }
      return {
        message: data.message || 'Ошибка удаления должности',
        error: data.error
      };
    }

    return { message: 'Должность успешно удалена' };

  } catch (error) {
    console.error('Job deletion error:', error);
    return {
      message: error instanceof Error ? error.message : 'Внутренняя ошибка сервера',
      error: 'Internal Server Error'
    };
  }
}

export { getAllJobs, getJob, createJob, updateJob, deleteJob };