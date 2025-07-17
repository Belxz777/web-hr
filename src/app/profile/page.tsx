"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import useEmployeeData from "@/hooks/useGetUserData";
import { logout } from "@/components/server/auth/logout";
import UniversalFooter from "@/components/buildIn/UniversalFooter";
import { Header } from "@/components/ui/header";
import { EmployeeResponsibilities } from "@/components/ui/ProfilePage/EmployeeResponsibilities";
import { RoutesBoss } from "@/components/buildIn/ReportDownload";


// Вынесена в отдельную утилиту для повторного использования
const checkAndClearExpiredLocalStorage = () => {
  const now = new Date().getTime();

  Object.keys(localStorage).forEach((key) => {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return;

      const item = JSON.parse(itemStr);
      if (item?.expiryDate && now > item.expiryDate) {
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.error(`Error processing localStorage key ${key}:`, e);
    }
  });
};

export default function ProfilePage() {
  const router = useRouter();
  const {
    employeeData,
    loadingEmp:loadingEmp,
    error: employeeError,
  } = useEmployeeData();

  const position = useMemo(() => employeeData?.user?.position, [employeeData]);
  const isLoading = useMemo(() => loadingEmp || !employeeData || !position, 
    [loadingEmp, employeeData, position]);

  // Обработчик выхода
  const handleLogout = useCallback(async () => {
    const isConfirmed = confirm("Вы уверены что хотите выйти?");
    if (!isConfirmed) return;

    try {
      // Сохраняем заметки перед очисткой

      await logout();
      
      // Очищаем localStorage, сохраняя заметки
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [router]);

  // Данные для отображения
  const profileContent = useMemo(() => {
    if (isLoading && !employeeData) {
      return (
        <div className="animate-pulse space-y-4">
          <div className="space-y-2">
            <div className="h-8 bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40 rounded-lg w-3/4 animate-shimmer bg-[length:200%_100%]" />
            <div className="h-8 bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40 rounded-lg w-2/3 animate-shimmer bg-[length:200%_100%]" />
          </div>
          <div className="space-y-2">
            <div className="h-6 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-md w-1/2 animate-shimmer bg-[length:200%_100%]" />
            <div className="h-6 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-md w-2/3 animate-shimmer bg-[length:200%_100%]" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <div className="h-10 bg-gradient-to-r from-secondary/30 via-secondary/50 to-secondary/30 rounded-xl w-32 animate-shimmer bg-[length:200%_100%]" />
            <div className="h-10 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 rounded-xl w-24 animate-shimmer bg-[length:200%_100%]" />
          </div>
                   <h1 className=" text-red-700">{loadingEmp}</h1>
        </div>
        
      );
    }
if (employeeError.status) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-primary font-medium text-lg mb-2">
            Ошибка загрузки
          </div>
          <div className="text-muted-foreground">
            {employeeError.text}
          </div>
        </div>
      </div>
    );
  }
    if (employeeData?.user && employeeError.status===false) {
      return (
        <div className="space-y-4">
          <div className="cursor-pointer group">
            <h2 className="text-2xl text-foreground font-bold mb-2 select-none transition-colors duration-200">
              {employeeData.user.firstName} <br />
              {employeeData.user.lastName}
            </h2>
            <div className="space-y-1">
              <p className="text-muted-foreground select-none">
                Должность:{" "}
                <span className="font-bold text-foreground">
                  {employeeData.job?.jobName}
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
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/90 transition-all duration-200 font-medium shadow-md hover:shadow-lg active:scale-95"
            >
              Сменить пароль
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-200 font-medium shadow-md hover:shadow-lg active:scale-95"
            >
              Выйти
            </button>
          </div>
        </div>
      );
    }

    return null;
  }, [isLoading, employeeError, employeeData, router, handleLogout]);

  return (
    <div className="mainProfileDiv">
      <Header
        title="Личный кабинет"
        position={position || 1}
        showPanel
      />
      <main className="container mx-auto p-4">
        <section className="bg-card/95 backdrop-blur-sm rounded-xl p-6 border border-border shadow-lg">
          <div className="min-h-[160px] w-full">
            {profileContent}
          </div>
        </section>
        <div>
          <EmployeeResponsibilities
            responsibilitiesFs={employeeData?.deputy || []}
            position={employeeData?.user?.position}
            isLoading={!employeeData || !employeeData.user.position}
          />
        </div>
        {(employeeData?.user.position !== 1 ) && employeeData ? (
          <RoutesBoss  position={employeeData.user.position} />
        ) : null}

        <div></div>
      </main>
      <UniversalFooter />
    </div>
  );
}
