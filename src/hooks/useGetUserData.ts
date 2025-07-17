import { useState, useEffect, useRef } from 'react';
import authUser from '@/components/server/auth/auth';
import { checkAndClearStorage } from '@/components/utils/checktime';

interface Deputy {
  deputyId: number;
  deputyName: string;
  compulsory: boolean;
}

interface Job {
  jobName: string;
  deputy: number;
}

interface User {
  employeeId: number;
  firstName: string;
  lastName: string;
  position: number;
}

interface AuthResponse {
  user: User;
  job: Job;
  department: string;
  deputy: Deputy[];
}

interface ErrorState {
  status: boolean;
  text: string;
}

const useEmployeeData = () => {
  const [employeeData, setData] = useState<AuthResponse | null>(null);
  const [loadingEmp, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState>({
    status: false,
    text: "",
  });
  
  const mountedRef = useRef(true);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        setError({ status: false, text: "" });

        if (typeof window !== 'undefined') {
          checkAndClearStorage();
        }

        const response = await authUser();
        
        if (mountedRef.current) {
          setData(response);
          setLoading(false);
        }
      } catch (err) {
        if (mountedRef.current) {
          const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
          setError({
            status: true,
            text: errorMessage,
          });
          setLoading(false);
        }
      }
    };

    fetchEmployeeData();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const title = employeeData?.job.jobName || '';

  return { 
    employeeData, 
    title, 
    loadingEmp, 
    error 
  };
};

export default useEmployeeData;