import { useEffect, useState } from "react";
import { getAllJobs, ErrorResponse } from "@/components/server/admin/job";

interface Job {
  id: number;
  name: string;
  pre_positioned?: number;
}

const useGetAllJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<{ message: string; status?: number } | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await getAllJobs();

        // Type guard to check if response is not an ErrorResponse
        if ('data' in response) {
          // Ensure the response has valid data
          if (!Array.isArray(response.data)) {
            throw new Error("Invalid jobs data format");
          }

          // Map the job data to the desired format
          setJobs(response.data.map(job => ({
            id: job.id,
            name: job.name,
            ...(job.pre_positioned !== undefined && { pre_positioned: job.pre_positioned })
          })));
        } else {
          // Handle the ErrorResponse case
          throw new Error(response.message);
        }

      } catch (err) {
        console.error("Jobs fetch error:", err);
        setError({
          message: err instanceof Error ? err.message : "Unknown error occurred",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return { 
    jobs, 
    loading, 
    error,
    isEmpty: !loading && jobs.length === 0
  };
};

export default useGetAllJobs;
