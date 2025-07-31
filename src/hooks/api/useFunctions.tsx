"use client";

import { useEffect, useState } from "react";
import { getAllFunctionsForReport } from "@/components/server/userdata/functions";
import { FunctionItem } from "@/types";

const useFunctionsForReport = () => {
  const [functions, setFunctions] = useState<FunctionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFunctions = async () => {
      try {
        const data = await getAllFunctionsForReport();
        if ("data" in data) {
          setFunctions(data.data);
          console.log()
        } else {
          setError(data.message);
        }
      } catch (err) {
        console.error("Error fetching functions:", err);
        setError("Не удалось загрузить список функций");
      } finally {
        setLoading(false);
      }
    };

    fetchFunctions();
  }, []);

  return { functions, loading, error };
};

export default useFunctionsForReport;
