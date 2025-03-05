<<<<<<< HEAD
import getEmployees from "@/components/server/emps_get";
import {getAllJobs} from "@/components/server/jobs";
=======
import { getAllJobs } from "@/components/server/jobs";
>>>>>>> 23ab5e80a9201e243da344df8a14ed66cdb72e5a
import { useEffect, useState } from "react";

const useGetAllJobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await getAllJobs();

        if (response === null) {
          throw new Error("Failed to fetch jobs");
        }
        const data = Array.isArray(response) ? response : [];
        setJobs(data);
      } catch (err) {
        console.log(err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return { jobs, loading, error };
};

export default useGetAllJobs;
