"use client";

import useEmployeeData from "@/hooks/useGetUserData";

import { logout } from "@/components/server/auth/logout";
import { RoutesBoss } from "@/components/buildIn/ReportDownload";
import UniversalFooter from "@/components/buildIn/UniversalFooter";
import { Header } from "@/components/ui/header";
import { EmployeeResponsibilities } from "@/components/ui/ProfilePage/EmployeeResponsibilities";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
const setLocalStorageWithExpiry = (key: string, value: any) => {
  const now = new Date();
  const item = {
    value: value,
    timestamp: now.getTime(),
    expiryDate: new Date(now).setHours(19, 0, 0, 0),
  };
  localStorage.setItem(key, JSON.stringify(item));
};

const checkAndClearExpiredLocalStorage = () => {
  const now = new Date();

  Object.keys(localStorage).forEach((key) => {
    const itemStr = localStorage.getItem(key);
    if (itemStr) {
      try {
        const item = JSON.parse(itemStr);

        if (item.expiryDate && now.getTime() > item.expiryDate) {
          localStorage.removeItem(key);
        }
      } catch (e) {}
    }
  });
};

const getLocalStorageWithExpiry = (key: string) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();
  const clearTime = new Date();
  clearTime.setHours(19, 0, 0, 0);

  if (new Date(item.timestamp) < clearTime && now >= clearTime) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
};

export default function ProfilePage() {
  const router = useRouter();
  const {
    employeeData,
    title,
    loadingEmp,
    error: employeeError,
  } = useEmployeeData();
  const [workedhours, setworkedhours] = useState(0);
  const position = useMemo(() => employeeData?.user?.position, [employeeData]);
  
const isLoading = useMemo(() => !employeeData || !position, [employeeData, position]);
  useEffect(() => {
    checkAndClearExpiredLocalStorage();
    let hours = getLocalStorageWithExpiry("hourstoday");
    setworkedhours(hours);
  }, []);

  return (
    <div className="mainProfileDiv">
      <Header
        title="Личный кабинет"
        position={employeeData?.user?.position || 1}
        showPanel
      />
      <main className="container mx-auto p-4">
        <section className="bg-card/95 backdrop-blur-sm rounded-xl p-6 border border-border shadow-lg">
          <div className="min-h-[160px] w-full">
            {loadingEmp ? (
              <div className="animate-pulse space-y-4">
                <div className="space-y-2">
                  <div className="h-8 bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40 rounded-lg w-3/4 animate-shimmer bg-[length:200%_100%]"></div>
                  <div className="h-8 bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40 rounded-lg w-2/3 animate-shimmer bg-[length:200%_100%]"></div>
                </div>

                <div className="space-y-2">
                  <div className="h-6 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-md w-1/2 animate-shimmer bg-[length:200%_100%]"></div>
                  <div className="h-6 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-md w-2/3 animate-shimmer bg-[length:200%_100%]"></div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <div className="h-10 bg-gradient-to-r from-secondary/30 via-secondary/50 to-secondary/30 rounded-xl w-32 animate-shimmer bg-[length:200%_100%]"></div>
                  <div className="h-10 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 rounded-xl w-24 animate-shimmer bg-[length:200%_100%]"></div>
                </div>
              </div>
            ) : employeeData ? (
              <div className="space-y-4">
                <div className="cursor-pointer group">
                  <h2 className="text-2xl text-foreground font-bold mb-2 select-none  transition-colors duration-200">
                    {employeeData.user.firstName} <br />
                    {employeeData.user.lastName}
                  </h2>
                  <div className="space-y-1">
                    <p className="text-muted-foreground select-none">
                      Должность:{" "}
                      <span className="font-bold text-foreground">
                        {employeeData.job.jobName}
                      </span>
                    </p>
                    <p className="text-muted-foreground select-none">
                      Отдел:{" "}
                      <span className="font-bold text-foreground">
                        {employeeData.department}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={() => router.push("/changePass")}
                    className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/90 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Сменить пароль
                  </button>
                  <button
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                    onClick={() => {
                      const is = confirm("Вы уверены что хотите выйти?");
                      if (!is) return;
                      logout();
                      const notes = localStorage.getItem("notes");
                      localStorage.clear();
                      if (notes) localStorage.setItem("notes", notes);
                      router.push("/");
                    }}
                  >
                    Выйти
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-primary font-medium text-lg mb-2">
                    Ошибка загрузки
                  </div>
                  <div className="text-muted-foreground">
                    {!loadingEmp && employeeError.text}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        <div>
          <EmployeeResponsibilities
            responsibilitiesFs={employeeData?.deputy || []}
            position={employeeData?.user?.position}
            isLoading={!employeeData || !employeeData.user.position}
          />
          {/* на будущее, чтобы выводить доп. опции у начальников разных позиций */}
          {/* {employeeData?.user.position &&
            employeeData.user.position >= 2 &&
            employeeData.user.position <= 4 && (
              <EmployeeResponsibilities
                responsibilitiesFs={employeeData?.deputy}
                position={employeeData?.user.position}
              />
            )}
          {employeeData?.user.position === 5 && (
            <EmployeeResponsibilities
              responsibilitiesFs={employeeData?.deputy}
              position={employeeData?.user.position}
            />
          )} */}
        </div>
        {(employeeData?.user.position !== 1 ) && employeeData ? (
          <RoutesBoss />
        ) : null}

        <div></div>
      </main>
      <UniversalFooter />
    </div>
  );
}
