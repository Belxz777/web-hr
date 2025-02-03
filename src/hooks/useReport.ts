import { useEffect, useState } from "react";
import { userTaskstoReport } from "@/components/server/userdata";
import { useIsMounted } from "./useTasks";

export const useReport = () => {
    const [tasks, setTasks] = useState<any>([]);
    const [loadingRep, setLoading] = useState<boolean>(false);
    const [error, setError] = useState({
        status: false,
        text: "",
    });
    async function getTasks() {
        try {
            setLoading(true);
            const response = await userTaskstoReport();
            setTasks(response);
        } catch (error) {
            setError({ status: true, text: `Ошибка сервера` });
        } finally {
            setLoading(false);
        }
    }
    
    const isMounted = useIsMounted();
    useEffect(() => {
        const fetchData = async () => {
            await getTasks();
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { tasks, isMounted, getTasks, error, loadingRep }
}
