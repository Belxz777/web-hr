import getEmployees from "@/components/server/emps_get";
import { useEffect, useState } from "react";

export const useEmployees = (employeeData: any) => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!employeeData?.departmentid) return;

    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const data = await getEmployees(employeeData.departmentid);
        console.log(data);

        setEmployees(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [employeeData]);

  return { employees, loading, error };
};
