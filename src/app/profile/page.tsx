"use client";

import Link from "next/link";
import useEmployeeData from "@/hooks/useGetUserData";
import { useRouter } from "next/navigation";
import { logout } from "@/components/server/logout";
import { PulseLogo } from "@/svgs/Logo";
import { useTasks } from "@/hooks/useTasks";
import { task, TFData } from "@/types";
import { TaskList } from "@/components/buildIn/TaskList";
import { ReportDownload } from "@/components/buildIn/ReportDownload";
import { ReportUpload } from "@/components/buildIn/ReportUpload";
import { useEffect, useState } from "react";
import UniversalFooter from "@/components/buildIn/UniversalFooter";
import { Header } from "@/components/ui/header";
import { useUserStore } from "@/store/userStore";
import allTfByDepartment from "@/components/server/allTfByDepartment";

export default function ProfilePage() {
  const router = useRouter();
  const {
    employeeData,
    title,
    loadingEmp,
    error: employeeError,
  } = useEmployeeData();
  const { isBoss } = useUserStore();
  const [showAllResponsibilities, setShowAllResponsibilities] = useState(false);
  const [responsibilities, setResponsibilities] = useState<TFData[]>([]);
  const [position, setPosition] = useState<number>(1);
  const [theme, setTheme] = useState("dark");
  const initialDisplayCount = 3;
  const displayedData = showAllResponsibilities
    ? responsibilities
    : responsibilities.slice(0, initialDisplayCount);

  useEffect(() => {
    if (!employeeData) return;

    const fetchResponsibilities = async () => {
      try {
        let data;
        if (employeeData.position === 1) {
          data = await allTfByDepartment("employee");
        } else if (employeeData.position <= 4) {
          data = await allTfByDepartment(
            "department",
            employeeData.departmentid
          );
        } else {
          data = await allTfByDepartment("all");
        }
        setResponsibilities(data || []);
      } catch (error) {
        console.error("Failed to fetch responsibilities:", error);
      }
    };

    fetchResponsibilities();
  }, [employeeData]);

  useEffect(() => {
    setTimeout(() => {
      if (employeeData) {
        setPosition(employeeData.position);
      }
    }, 3000);
  }, [employeeData]);

  return (
    <div className="mainProfileDiv">
      <Header
        title="Личный кабинет"
        position={employeeData?.position}
        showPanel
      />
      <main className="container mx-auto p-4">
        <section className="sectionStyles">
          {loadingEmp ? (
            <div className="w-1/2 animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-4/6 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/5"></div>
            </div>
          ) : employeeData ? (
            <div className="mb-4 md:mb-0 cursor-pointer">
              <h2 className="text-2xl font-bold mb-2 select-none">
                {employeeData.firstName} {employeeData.lastName}
              </h2>
              <p className="text-gray-400 select-none">{title}</p>
              <p className="text-gray-400 select-none">
                Отдел № {employeeData.departmentid}
              </p>
              <div className="flex gap-4 justify-between my-2">
                <button
                  onClick={() => router.push("/report")}
                  className="buttonRedirectStyles"
                >
                  Заполнение отчета
                </button>
              </div>
            </div>
          ) : (
            <h1>{!loadingEmp && employeeError.text}</h1>
          )}
          <div className="space-y-2">
            <button
              className="buttonRedirectStyles"
              onClick={() => {
                router.push("/changePass");
              }}
            >
              Сменить пароль
            </button>
            <button
              className="buttonLogoutStyles"
              onClick={() => {
                let is = confirm("Вы уверены что хотите выйти?");
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
          {employeeData?.position === 1 && (
            <div className="flex flex-col gap-2 taskSectionStyles">
              <h2 className="text-2xl font-bold">
                Ваши функциональные обязанности
              </h2>
              <div className="flex justify-between items-center flex-col mb-4 w-full">
                {responsibilities.length == 0 ? (
                  [1, 2, 3, 4, 5].map((e) => (
                    <div className="w-full animate-pulse">
                      <div className="h-10 bg-gray-700 rounded w-full mb-4"></div>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between items-end flex-col w-full">
                    {responsibilities.length > initialDisplayCount && (
                      <button
                        onClick={() =>
                          setShowAllResponsibilities(!showAllResponsibilities)
                        }
                        className={`text-sm px-3 py-1 rounded ${
                          theme === "dark"
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-red-100 hover:bg-red-200 text-red-800"
                        }`}
                      >
                        {showAllResponsibilities
                          ? "Скрыть"
                          : `Показать все (${responsibilities.length})`}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {[...displayedData]
                  .sort((a, b) =>
                    a.isMain === b.isMain ? 0 : a.isMain ? -1 : 1
                  )
                  .map((item: TFData) => (
                    <div
                      key={item.tfId}
                      className={`${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                      } rounded-lg p-3`}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-base">{item.tfName}</h3>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              item.isMain === false
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            Тип {item.isMain ? "Основная" : "Дополнительная"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {!showAllResponsibilities &&
                responsibilities.length > initialDisplayCount && (
                  <div className="mt-2 text-center">
                    <button
                      onClick={() => setShowAllResponsibilities(true)}
                      className={`text-sm ${
                        theme === "dark"
                          ? "text-red-400 hover:text-red-300"
                          : "text-red-600 hover:text-red-700"
                      }`}
                    >
                      Показать еще{" "}
                      {responsibilities.length - initialDisplayCount}{" "}
                      обязанностей...
                    </button>
                  </div>
                )}
            </div>
          )}
          {employeeData?.position &&
            employeeData.position >= 2 &&
            employeeData.position <= 4 && (
              <div className="flex flex-col gap-2 taskSectionStyles">
                <h2 className="text-2xl font-bold">
                  Функциональные обязанности отдела
                </h2>
                <div className="flex justify-between items-center flex-col mb-4 w-full">
                  {responsibilities.length == 0 ? (
                    [1, 2, 3, 4, 5].map((e) => (
                      <div className="w-full animate-pulse">
                        <div className="h-10 bg-gray-700 rounded w-full mb-4"></div>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between items-end flex-col w-full">
                      {responsibilities.length > initialDisplayCount && (
                        <button
                          onClick={() =>
                            setShowAllResponsibilities(!showAllResponsibilities)
                          }
                          className={`text-sm px-3 py-1 rounded ${
                            theme === "dark"
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-red-100 hover:bg-red-200 text-red-800"
                          }`}
                        >
                          {showAllResponsibilities
                            ? "Скрыть"
                            : `Показать все (${responsibilities.length})`}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {[...displayedData]
                    .sort((a, b) =>
                      a.isMain === b.isMain ? 0 : a.isMain ? -1 : 1
                    )
                    .map((item: TFData) => (
                      <div
                        key={item.tfId}
                        className={`${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                        } rounded-lg p-3`}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-base">
                            {item.tfName}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                item.isMain === false
                                  ? "bg-green-500 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              Тип {item.isMain ? "Основная" : "Дополнительная"}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs bg-blue-500 text-white`}
                            >
                              Время {item.time} ч
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {!showAllResponsibilities &&
                  responsibilities.length > initialDisplayCount && (
                    <div className="mt-2 text-center">
                      <button
                        onClick={() => setShowAllResponsibilities(true)}
                        className={`text-sm ${
                          theme === "dark"
                            ? "text-red-400 hover:text-red-300"
                            : "text-red-600 hover:text-red-700"
                        }`}
                      >
                        Показать еще{" "}
                        {responsibilities.length - initialDisplayCount}{" "}
                        обязанностей...
                      </button>
                    </div>
                  )}
              </div>
            )}
          {employeeData?.position === 5 && (
            <div className="flex flex-col gap-2 taskSectionStyles">
              <h2 className="text-2xl font-bold">
                Все Функциональные обязанности
              </h2>
              <div className="flex justify-between items-center flex-col mb-4 w-full">
                {responsibilities.length == 0 ? (
                  [1, 2, 3, 4, 5].map((e) => (
                    <div className="w-full animate-pulse">
                      <div className="h-10 bg-gray-700 rounded w-full mb-4"></div>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between items-end flex-col w-full">
                    {responsibilities.length > initialDisplayCount && (
                      <button
                        onClick={() =>
                          setShowAllResponsibilities(!showAllResponsibilities)
                        }
                        className={`text-sm px-3 py-1 rounded ${
                          theme === "dark"
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-red-100 hover:bg-red-200 text-red-800"
                        }`}
                      >
                        {showAllResponsibilities
                          ? "Скрыть"
                          : `Показать все (${responsibilities.length})`}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {[...displayedData]
                  .sort((a, b) =>
                    a.isMain === b.isMain ? 0 : a.isMain ? -1 : 1
                  )
                  .map((item: TFData) => (
                    <div
                      key={item.tfId}
                      className={`${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                      } rounded-lg p-3`}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-base">{item.tfName}</h3>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              item.isMain === false
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            Тип {item.isMain ? "Основная" : "Дополнительная"}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs bg-blue-500 text-white`}
                          >
                            Время {item.time} ч
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {!showAllResponsibilities &&
                responsibilities.length > initialDisplayCount && (
                  <div className="mt-2 text-center">
                    <button
                      onClick={() => setShowAllResponsibilities(true)}
                      className={`text-sm ${
                        theme === "dark"
                          ? "text-red-400 hover:text-red-300"
                          : "text-red-600 hover:text-red-700"
                      }`}
                    >
                      Показать еще{" "}
                      {responsibilities.length - initialDisplayCount}{" "}
                      обязанностей...
                    </button>
                  </div>
                )}
            </div>
          )}
        </div>
        {(employeeData?.position !== 1 || isBoss) && employeeData ? (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            {/* <ReportUpload /> */}
            <ReportDownload />
          </section>
        ) : null}
      </main>
      <UniversalFooter />
    </div>
  );
}
