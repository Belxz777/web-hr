"use client";

import useEmployeeData from "@/hooks/useGetUserData";
import { useRouter } from "next/navigation";
import { logout } from "@/components/server/auth/logout";
import { RoutesBoss } from "@/components/buildIn/ReportDownload";
import UniversalFooter from "@/components/buildIn/UniversalFooter";
import { Header } from "@/components/ui/header";
import { useUserStore } from "@/store/userStore";
import { EmployeeResponsibilities } from "@/components/ui/ProfilePage/EmployeeResponsibilities";
export default function ProfilePage() {
  const router = useRouter();
  const {
    employeeData,
    title,
    loadingEmp,
    error: employeeError,
  } = useEmployeeData();
  const { isBoss } = useUserStore();

  // доп - это не компалсари, а functions - это под. функции для фс

  return (
    <div className="mainProfileDiv">
      <Header
        title="Личный кабинет"
        position={employeeData?.user?.position || 1}
        showPanel
      />
      <main className="container mx-auto p-4">
        <section className="sectionStyles">
          {loadingEmp ? (
            <div className="w-1/2 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-4/6 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/5"></div>
            </div>
          ) : employeeData ? (
            <div className="mb-4 md:mb-0 cursor-pointer">
              <h2 className="text-2xl text-[#434343] font-bold mb-2 select-none">
                {employeeData.user.firstName} <br />{" "}
                {employeeData.user.lastName}
              </h2>
              <p className="text-gray-400 select-none">
                Должность:{" "}
                <span className="font-extrabold">
                  {" "}
                  {employeeData.job.jobName}{" "}
                </span>
              </p>
              <p className="text-gray-400 select-none">
                Отдел:{" "}
                <span className="font-extrabold">
                  {employeeData.department}
                </span>
              </p>
            </div>
          ) : (
            <h1>{!loadingEmp && employeeError.text}</h1>
          )}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={() => router.push("/changePass")}
              className="px-4 py-2 bg-[#249BA2] text-white rounded-xl hover:bg-[#1e8a90] transition-colors"
            >
              Сменить пароль
            </button>
            <button
              className="px-4 py-2 bg-[#FF0000] text-white rounded-xl hover:bg-red-700 transition-colors"
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
        </section>
        <div>
          {employeeData?.user.position && (
            <EmployeeResponsibilities
              responsibilitiesFs={employeeData?.deputy}
              position={employeeData?.user.position}
            />
          )}
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
        {(employeeData?.user.position !== 1 || isBoss) && employeeData ? (
          <RoutesBoss />
        ) : null}
      </main>
      <UniversalFooter />
    </div>
  );
}
