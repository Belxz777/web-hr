import { useEffect, useState } from "react";
import { task } from "@/types";
import { userTasks } from "@/components/server/userdata";

export const useTasks = () => {
    const [tasks, setTasks] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState({
        status: false,
        text: "",
    });
    async function getTasks() {
        try {
            setLoading(true);
            const response = await userTasks();
            setTasks(response);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError({ status: true, text: `Ошибка сервера` });
        }
    }
    
    const isMounted = useIsMounted();
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                getTasks();
            } catch (error) {
                setLoading(false);
                setError({ status: true, text: `Ошибка сервера` });
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { tasks, isMounted, getTasks, error, loading };
};
export const useIsMounted = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);
    return isMounted;
};