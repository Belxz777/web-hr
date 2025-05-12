import { useEffect, useState } from "react";
import getPerformanceData from "@/components/server/userdata/performance";
const isBoss = false;
export const useemployeeData = (emp:number) => {
    const [employeeData, setemployeeData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState({
        status: false,
        text: "",
    });
    
    const isMounted = useIsMounted();
    useEffect(() => {

        const fetchData = async () => {
            try {
                setLoading(true);
                const data  = await getPerformanceData(emp)
                setemployeeData(data)
            } catch (error) {
                setLoading(false);
                setError({ status: true, text: `Ошибка сервера` });
            }
            setLoading(false)
        };
fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { employeeData, isMounted,loading  };
};
export const useIsMounted = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);
    return isMounted;
};