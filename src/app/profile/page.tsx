"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import useEmployeeData from "@/hooks/useGetUserData"
import { logout } from "@/components/server/auth/logout"
import UniversalFooter from "@/components/buildIn/UniversalFooter"
import { Header } from "@/components/ui/header"
import { EmployeeResponsibilities } from "@/components/ui/ProfilePage/EmployeeResponsibilities"
import { RoutesBoss } from "@/components/buildIn/ReportDownload"
import ToastComponent from "@/components/toast/toast"

export default function ProfilePage() {
  const router = useRouter()
  const { employeeData, loadingEmp, error: employeeError } = useEmployeeData()

  const position = employeeData?.user?.position
  const isLoading = loadingEmp || !employeeData || !position

  const handleLogout = useCallback(async () => {
    const isConfirmed = confirm("Вы уверены что хотите выйти?")
    if (!isConfirmed) return

    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }, [router])

  const renderProfileContent = () => {
    if (isLoading && !employeeData) {
      return (
        <div className="opacity-100 transition-opacity duration-500 ease-in-out">
          <div className="animate-pulse space-y-4">
            <div className="space-y-2">
              <div className="h-8 bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40 rounded-lg w-3/4 animate-shimmer bg-[length:200%_100%]" />
              <div className="h-8 bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40 rounded-lg w-2/3 animate-shimmer bg-[length:200%_100%]" />
            </div>
            {/* 
            <div className="space-y-2 mt-4">
              <div className="h-6 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-md w-1/2 animate-shimmer bg-[length:200%_100%]" />
              <div className="h-6 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-md w-2/3 animate-shimmer bg-[length:200%_100%]" />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <div className="h-12 bg-gradient-to-r from-secondary/30 via-secondary/50 to-secondary/30 rounded-xl w-36 animate-shimmer bg-[length:200%_100%]" />
              <div className="h-12 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 rounded-xl w-36 animate-shimmer bg-[length:200%_100%]" />
            </div>*/}
          </div>
        </div>
      )
    }

    if (employeeError.status) {
      return (
        <div className="opacity-100 transition-opacity duration-500 ease-in-out flex items-center justify-center h-full min-h-[200px]">
          <div className="text-center">
            <div className="text-primary font-medium text-lg mb-2">Ошибка загрузки</div>
            <div className="text-muted-foreground">{employeeError.text}</div>
          </div>
        </div>
      )
    }

    if (employeeData?.user) {
      return (
        <div className="opacity-100 transition-opacity duration-500 ease-in-out space-y-4">
          <div className="cursor-pointer group">
            <h2 className="text-2xl text-foreground font-bold mb-2 select-none transition-colors duration-200">
              {/* {employeeData.user.firstName} <br /> */}
            Ваш код: <span className=" font-extrabold">{employeeData.user.lastName}</span>  
            </h2>
            <div className="space-y-1 mt-4">
              <p className="text-muted-foreground select-none">
                Должность: <span className="font-bold text-foreground">{employeeData.job?.jobName}</span>
              </p>
              <p className="text-muted-foreground select-none">
                Отдел: <span className="font-bold text-foreground">{employeeData.department}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={() => router.push("/changePass")}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/90 transition-all duration-200 font-bold shadow-md hover:shadow-lg active:scale-95"
            >
              Сменить пароль
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-200 font-bold shadow-md hover:shadow-lg active:scale-95"
            >
              Выйти
            </button>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="mainProfileDiv">
      <ToastComponent />
      <Header title="Личный кабинет" position={position || 1} showPanel />
      <main className="container mx-auto p-4">
        <section className="bg-card/95 backdrop-blur-sm rounded-xl p-6 border border-border shadow-lg transition-all duration-300 ease-in-out">
          <div className="min-h-[140px] w-full flex flex-col justify-start transition-all duration-500 ease-in-out">
            {renderProfileContent()}
          </div>
        </section>

  
        {position && position !== 1 ? (
          <div className="transition-all duration-700 ease-in-out delay-100 opacity-100 translate-y-0">
            <RoutesBoss position={position} />
          </div>
        ) : null}
      </main>
      <UniversalFooter />
    </div>
  )
}