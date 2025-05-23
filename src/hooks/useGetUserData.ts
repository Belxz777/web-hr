// hooks/useEmployeeData.js
import authUser from '@/components/server/auth/auth';
import { checkAndClearStorage } from '@/components/utils/checktime';
// import { fetchTitle } from '@/components/server/userdata/jobtitle';
import { employee } from '@/types';
import { useState, useEffect } from 'react';
interface Deputy {
  deputyId: number
  deputyName: string
  compulsory: boolean
}

interface Job {
  jobName: string
  deputy: number
}

interface User {
  employeeId: number
  firstName: string
  lastName: string
  position: number
}

interface AuthResponse {
  user: User
  job: Job,
  department:string,
  deputy: Deputy[]
}
interface Department {
  departmentName: string
}
const useEmployeeData = () => {
  const [employeeData, setData] = useState<AuthResponse | null >(null);
  const [title, setTitle] = useState<string>('');
  const [loadingEmp, setLoading] = useState(true);
  const [error, setError] = useState({
    status: false,
    text: "",
});
  const abortController = new AbortController();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      checkAndClearStorage();      
    }
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        const response = await authUser();
        setData(response);
        setTitle(response?.job.jobName || '');
      } catch (err) {
        if (err instanceof Error) {
          setError({
            status: true,
            text: err.message,
          });
        } else {
          setError({
            status: true,
            text: 'An unexpected error occurred',
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeData().catch(err => {
      setError({
        status: true,
        text: err.message,
      });
    });
    return () =>{
abortController.abort();
    }
  }, []);

  return { employeeData, title, loadingEmp, error };
};
export default useEmployeeData;