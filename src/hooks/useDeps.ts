import getAllDepartments from "@/components/server/departments";
import { useEffect, useState } from "react";

const useGetAlldeps = () => {
  const [deps, setdeps] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchinfo = async () => {
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
    };

    fetchinfo();
  }, []);

  return { deps, loading, error };
};

export default useGetAlldeps;
