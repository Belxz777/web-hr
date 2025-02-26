// hooks/useEmployeeData.js
import authUser from '@/components/server/auth';
import { fetchTitle } from '@/components/server/jobtitle';
import { employee } from '@/types';
import { useState, useEffect } from 'react';

const useEmployeeData = () => {
  const [employeeData, setData] = useState<employee | null >(null);
  const [title, setTitle] = useState<string>('');
  const [loadingEmp, setLoading] = useState(true);
  const [error, setError] = useState({
    status: false,
    text: "",
});
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
