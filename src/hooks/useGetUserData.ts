"use client"

import { useState, useEffect, useRef, useCallback } from 'react';
import authUser from '@/components/server/auth/auth';
import { checkAndClearStorage } from '@/components/utils/checktime';
import { employeeprofile } from '@/types';

interface Deputy {
  deputyId: number;
  deputyName: string;
  compulsory: boolean;
}

interface Job {
  jobName: string;
  deputy?: number;
}

interface AuthResponseData {
  user: employeeprofile;
  department: string;
  job: Job;
  deputy?: Deputy[];
}

interface AuthResponse {
  message: string;
  data: AuthResponseData;
}

interface ErrorState {
  status: boolean;
  text: string;
  code?: string;
}

const useEmployeeData = () => {
  const [employeeData, setData] = useState<AuthResponseData | null>(null);
  const [loadingEmp, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState>({
    status: false,
    text: "",
  });
  
  const mountedRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const fetchEmployeeData = useCallback(async () => {
    try {
      setLoading(true);
      setError({ status: false, text: "" });

      if (typeof window !== 'undefined') {
        checkAndClearStorage();
      }

      // Устанавливаем таймаут на запрос (10 секунд)
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          reject(new Error('Request timeout: Сервер не отвечает'));
        }, 10000);
      });

      const response = await Promise.race([authUser(), timeoutPromise]);
      
      if (mountedRef.current) {
        clearTimeouts();
        setData(response);
        setLoading(false);
      }
    } catch (err) {
      if (mountedRef.current) {
        clearTimeouts();
        
        let errorMessage = 'An unexpected error occurred';
        let errorCode: string | undefined;

        if (err instanceof Error) {
          errorMessage = err.message;
          
          // Извлекаем код ошибки из сообщения (если есть)
          if (errorMessage.includes('token_expired')) {
            errorCode = 'token_expired';
          } else if (errorMessage.includes('invalid_token')) {
            errorCode = 'invalid_token';
          } else if (errorMessage.includes('auth_error')) {
            errorCode = 'auth_error';
          }
        }

        setError({
          status: true,
          text: errorMessage,
          code: errorCode
        });
        setLoading(false);
      }
    }
  }, [clearTimeouts]);

  useEffect(() => {
    fetchEmployeeData();

    return () => {
      mountedRef.current = false;
      clearTimeouts();
    };
  }, [fetchEmployeeData, clearTimeouts]);

  const refetch = useCallback(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  return { 
    employeeData, 
    loadingEmp, 
    error,
    refetch
  };
};

export default useEmployeeData;