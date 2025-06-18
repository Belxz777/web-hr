import getAllDepartments from "@/components/server/admin/departments";
import { useEffect, useState, useCallback } from "react";

const useGetAlldeps = () => {
  const [deps, setdeps] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchinfo = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllDepartments();
      const data = Array.isArray(response) ? response : [];
      setdeps(data);
    } catch (err) {
      console.log(err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchinfo();
  }, [fetchinfo]);

  return { deps, loading, error, refetch: fetchinfo };
};

export default useGetAlldeps;

