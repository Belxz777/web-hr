// hooks/useEmployeeData.js
import authUser from '@/components/server/auth';
import { fetchTitle } from '@/components/server/jobtitle';
import { employee } from '@/types';
import { useState, useEffect } from 'react';

const useEmployeeData = () => {
  const [employeeData, setData] = useState<employee | null >(null);
  const [title, setTitle] = useState<string>('');
  const [loadingEmp, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const abortController = new AbortController();
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        const response = await authUser();
        setData(response);
        if (response?.jobid) {
          const jobTitle = await fetchTitle(response.jobid);
          setTitle(jobTitle);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeData().catch(err => {
      setError('Failed to fetch employee data');
    });
    return () =>{
abortController.abort();
    }
  }, []);

  return { employeeData, title, loadingEmp, error };
};
export default useEmployeeData;
