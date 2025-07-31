import { useEffect, useState, useCallback } from "react";
import { getDepartment } from "@/components/server/admin/department";

interface Department {
  id: number;
  name: string;
  description?: string;
}

const useGetAlldeps = () => {
  const [deps, setDeps] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<{ message: string; status?: number } | null>(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getDepartment();
      
      // Type guard to check if response is not an ErrorResponse
      if ('data' in response) {
        // Ensure the response has valid data
        if (!Array.isArray(response.data)) {
          throw new Error("Invalid departments data format");
        }

        // Map the department data to the desired format
        setDeps(response.data.map(dept => ({
          id: dept.id,
          name: dept.name,
          ...(dept.description && { description: dept.description })
        })));
      } else {
        // Handle the ErrorResponse case
        throw new Error(response.message);
      }

    } catch (err) {
      console.error("Departments fetch error:", err);
      setError({
        message: err instanceof Error ? err.message : "Unknown error occurred",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return { 
    deps, 
    loading, 
    error,
    isEmpty: !loading && deps.length === 0,
    refetch: fetchDepartments
  };
};

export default useGetAlldeps;
