'use client'
import useGetAlldeps from "@/hooks/useDeps";
import { Department } from "@/types";
import { useEffect, useState } from "react";

export default function FunctionsPage() {
const [activeTab, setActiveTab] = useState<"jobs"|"respos" | "functions">("respos");
  const [departments, setDepartments] = useState<Department[]>([]);

  const [loading, setLoading] = useState(false);
  const { deps, loading: isDepsLoading, refetch } = useGetAlldeps();

  useEffect(() => {
    setLoading(isDepsLoading);
    if (deps) {
      setDepartments(deps);
    }
  }, [deps, isDepsLoading]);
return (

<main>
 
    <h1>Выберите отдел</h1>
    <div className="flex flex-col gap-2 ">
        <div className="grid grid-cols-3 gap-4">
            {departments.map((department) => (
                <button
                    key={department.departmentId}
                    className="bg-primary text-white font-bold py-2 px-4 rounded"
                    onClick={() => setActiveTab(department.departmentName.toLowerCase() as "jobs" | "respos" | "functions")}
                >
                    {department.departmentName}
                </button>
            ))}
        </div>
        </div>
</main>
)
}
const Jobs = () => {
return (
<div>
    <h1>Jobs</h1>
</div>
)
}
const Respos = () => {
return (
<div>
    <h1>Respos</h1>
</div>
)
}
const Functions = () => {
return (
<div>
    <h1>Functions</h1>
</div>
)
}