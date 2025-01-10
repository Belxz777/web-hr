// hooks/useEmployeeData.js
import authUser from '@/components/server/auth';
import { fetchTitle } from '@/components/server/jobtitle';
import { employee } from '@/types';
import { useState, useEffect } from 'react';

const useEmployeeData = () => {
  const [employeeData, setData] = useState<employee | null >(null);
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

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
        localStorage.setItem('employeeFName', employeeData?.firstName || '');
        localStorage.setItem('employeeLName', employeeData?.lastName || '');
        localStorage.setItem('jobTitle', title);
        localStorage.setItem('departmentId', employeeData?.departmentid?.toString() || '');
      }
    };
    fetchEmployeeData();
  }, []);

  return { employeeData, title, loading, error };
};
export default useEmployeeData;
