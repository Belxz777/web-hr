"use client";

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createJob } from "@/components/server/jobs"
import { Header } from "@/components/ui/header"
import createDepartment from "@/components/server/createDepartment"
import { ReportUpload } from "@/components/buildIn/ReportUpload";
import getEmployees from "@/components/server/emps_get";
import promotion from "@/components/server/promotion";

// Types
type Employee = {
  employeeId: number
  firstName: string
  lastName: string
  position: string

}

type Department = {
  id: number
  name: string
  description: string
  head: Employee
}

type Position = {
  id: number
  title: string
  description: string
}

// Sample data


const positions: Position[] = [
  { id: 1, title: "Младший разработчик", description: "Начальная позиция разработчика" },
  { id: 2, title: "Разработчик", description: "Основная позиция разработчика" },
  { id: 3, title: "Старший разработчик", description: "Ведущая позиция разработчика" },
  { id: 4, title: "Дизайнер", description: "Позиция дизайнера" },
  { id: 5, title: "Менеджер", description: "Управляющая позиция" },
]

export default function AdminPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<
    "departments" | "positions" | "promotion" | "projects" | "reports" | "access" | "analytics" | "excel"
  >("departments")
  const [showNotification, setShowNotification] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [notificationMessage, setNotificationMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [showError, setShowError] = useState(false)

  // Department form state
  const [departmentForm, setDepartmentForm] = useState({
    name: "",
    description: "",
    headId: "",
  })

  // Position form state
  const [positionForm, setPositionForm] = useState({
    title: "",
    description: "",
  })

  // Promotion form state
  const [promotionForm, setPromotionForm] = useState({
    empid: "",
    position: "",
  })

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  console.log(selectedEmployee);
  

  useEffect(() => {
    // Имитация проверки на админа
    const checkAdmin = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsLoading(false)
    }
  
    checkAdmin()
  }, [])
useEffect(()=>{
  const getEmps = async () => {
const emps = await getEmployees();
if (emps){
  setEmployees(emps)
  }
  
}

if(activeTab =="promotion"){
getEmps()
}
},[activeTab])
  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Имитация проверки пароля
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (adminPassword === "123") {
      setIsAdmin(true)
      showSuccessNotification("Доступ предоставлен")
    } else {
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    }

    setIsLoading(false)
    setAdminPassword("")
  }

  const showSuccessNotification = (message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const handleDepartmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!departmentForm.name || !departmentForm.description || !departmentForm.headId) {
      console.error("Missing department information");
      showSuccessNotification("Пожалуйста, заполните все поля формы");
      return;
    }
  
    const formattedData = {
      departmentName: departmentForm.name,
      departmentDescription: departmentForm.description,
      headId: Number(departmentForm.headId),
    };
  
  
    try {
      const response = await createDepartment(formattedData);
  
      if (!response) {
        console.error("Failed to create department");
        showSuccessNotification("Ошибка при создании департамента");
        return;
      }
  
      console.log("Создание департамента:", formattedData);
      showSuccessNotification("Департамент успешно создан");
      setDepartmentForm({ name: "", description: "", headId: "" });
    } catch (error) {
      console.error("Ошибка при создании департамента:", error);
      showSuccessNotification("Произошла ошибка при создании департамента");
    }
  };
  

  const handlePositionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!positionForm.title) {
      console.error("Position title is required");
      showSuccessNotification("Пожалуйста, укажите название должности");
      return;
    }

    console.log(positionForm);
    try {
      const response = await createJob(positionForm.title);

      if (!response) {
        console.error("Failed to create position");
        showSuccessNotification("Ошибка при создании должности");
        return;
      }
      showSuccessNotification("Должность успешно создана");
      setPositionForm({ title: "", description: "" });
      
    } catch (error) {
      console.error("Error creating position:", error);
      showSuccessNotification("Произошла ошибка при создании должности");
    }
  }
const promote =  async (employeeId: number, newPosition: number) => {
  const request: { data: any } = await promotion(employeeId, newPosition)
  return request.data
}
  const handlePromotionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Повышение сотрудника:", promotionForm)
    promote(selectedEmployee)
    showSuccessNotification("Сотрудник успешно повышен")

    setPromotionForm({ employeeId: "", newPosition: "", level: 1 })
    setSelectedEmployee(null)

  }
  const [jobout, setjobout] = useState({
        jobId:0 ,
        jobName: ""
  })
async function createPos(name: string): Promise<any> {
    const request: { data: any } = await createJob(name)
    
    return request.data
}
  const handleEmployeeSelect = (employee:Employee): void => {
    console.log(employee);
    
    setSelectedEmployee(employee)
    
    setPromotionForm((prev) => ({ ...prev, empid: employee }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 text-gray-100">
 <Header title="Панель администратора" />

      <main className="container mx-auto p-4">
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("departments")}
            className={`px-4 py-2 rounded-xl transition-colors ${activeTab === "departments" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            Управление департаментами
          </button>
          <button
            onClick={() => setActiveTab("positions")}
            className={`px-4 py-2 rounded-xl transition-colors ${activeTab === "positions" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            Управление должностями
          </button>
          <button
            onClick={() => setActiveTab("promotion")}
            className={`px-4 py-2 rounded-xl transition-colors ${activeTab === "promotion" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            Повышение сотрудника
          </button>
          <button
            onClick={() => setActiveTab("excel")}
            className={`px-4 py-2 rounded-xl transition-colors ${activeTab === "excel" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            Загрузка Excel файла с задачами
          </button>

        </div>

        {activeTab === "departments" && (
          <section className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Создание нового департамента</h2>
            <form onSubmit={handleDepartmentSubmit} className="space-y-4">
              <div>
                <label htmlFor="departmentName" className="block text-sm font-medium text-gray-300 mb-2">
                  Название департамента
                </label>
                <input
                  id="departmentName"
                  type="text"
                  required
                  value={departmentForm.name}
                  onChange={(e) => setDepartmentForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Введите название департамента"
                />
              </div>

              <div>
                <label htmlFor="departmentDescription" className="block text-sm font-medium text-gray-300 mb-2">
                  Описание департамента
                </label>
                <textarea
                  id="departmentDescription"
                  required
                  value={departmentForm.description}
                  onChange={(e) => setDepartmentForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={4}
                  placeholder="Введите описание департамента"
                />
              </div>

              <div>
                <label htmlFor="departmentHead" className="block text-sm font-medium text-gray-300 mb-2">
                  Начальник департамента
                </label>
                <select
                  id="departmentHead"
                  required
                  value={departmentForm.headId}
                  onChange={(e) => setDepartmentForm((prev) => ({ ...prev, headId: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Выберите начальника департамента</option>
                  {/* {sampleEmployees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} - {employee.position}
                    </option>
                  ))} */}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Создать департамент
              </button>
            </form>
          </section>
        )}

        {activeTab === "positions" && (
          <section className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Создание новой должности</h2>
            <form className="space-y-4" onSubmit={handlePositionSubmit}>
              <div>
                <label htmlFor="positionTitle" className="block text-sm font-medium text-gray-300 mb-2">
                  Название должности
                </label>
                <input
                  id="positionTitle"
                  type="text"
                  required
                  value={positionForm.title}
                  onChange={(e) => setPositionForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Введите название должности"
                />
              </div>


              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Создать должность
              </button>
              {
                jobout && <p className="text-red-500">{jobout.jobName}</p>
              }
            </form>
          </section>
        )}

        {activeTab === "promotion" && (
          <section className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Повышение сотрудника</h2>
            <form onSubmit={handlePromotionSubmit} className="space-y-6">
              <div>
                <label htmlFor="employee" className="block text-sm font-medium text-gray-300 mb-2">
                  Выберите сотрудника
                </label>
                <select
                  id="employee"
                  required
                  value={promotionForm.employeeId}
                  onChange={(e) => handleEmployeeSelect(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Выберите сотрудника</option>
                  {employees.map((employee,index) => (
                    <option key={index} value={employee.employeeId}>
                      {employee.firstName}  {employee.lastName}  - {employee.position}
                    </option>
                  ))}
                </select>
              </div>

              {selectedEmployee && (
                <div className="bg-gray-700 p-4 rounded-xl">
                  <h3 className="font-medium text-gray-300 mb-2">Текущая позиция</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">{selectedEmployee.position}</p>
                      <p className="text-sm text-gray-400">Уровень: {selectedEmployee.currentLevel}</p>
                    </div>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-2 h-8 rounded ${
                            level <= selectedEmployee ? "bg-red-500" : "bg-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="newPosition" className="block text-sm font-medium text-gray-300 mb-2">
                  Новая должность
                </label>
                <select
                  id="newPosition"
                  required
                  value={promotionForm.newPosition}
                  onChange={(e) => setPromotionForm((prev) => ({ ...prev, newPosition: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Выберите новую должность</option>
                  {positions.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Новый уровень: {promotionForm.level}
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={promotionForm.level}
                    onChange={(e) => setPromotionForm((prev) => ({ ...prev, level: Number.parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setPromotionForm((prev) => ({ ...prev, level }))}
                        className={`w-8 h-8 rounded ${level <= promotionForm.level ? "bg-red-500 hover:bg-red-600" : "bg-gray-600 hover:bg-gray-500"
                          } transition-colors`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Повысить сотрудника
              </button>
            </form>
          </section>
        )}
        {activeTab === "excel" && (
          <section className="bg-gray-800 rounded-lg p-6 mb-6">
            <ReportUpload />
          </section>
        )}

        {/* Notification */}
        {showNotification && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in">
            {notificationMessage}
          </div>
        )}
      </main>
    </div>
  )
}

