"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import sendReport from "@/components/server/report";
import UniversalFooter from "@/components/buildIn/UniversalFooter";
import { Header } from "@/components/ui/header";
import { TFData } from "@/types";
import getAllFunctionsForReport from "@/components/server/getAllFunctionsForReport";
import { set } from "zod";

export default function ReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    func_id: 0,
    deputy_id: 0,
    workingHours: "0.50",
    comment: "",
  });
  const [responsibilities, setResponsibilities] = useState<{
    length: any;
    nonCompulsory: {
      deputyId: number
      deputyName: string
    }[],
    functions: {
      funcId: number
      funcName: string
    }[]
  }>({
    length: 0,
    nonCompulsory: [],
    functions: [],
  })
const [type,settype] = useState<string>("main");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllFunctionsForReport();
        setResponsibilities(data || []);
        if(data.functions.length === 1) {
          setFormData(prev => ({
            ...prev,
            func_id: data.functions[0].funcId
          }));
        }
        else if(data.nonCompulsory.length === 1) {
          setFormData(prev => ({
            ...prev,
            deputy_id: data.nonCompulsory[0].deputyId
          }));
        }
        console.log(formData,responsibilities.functions.length)
      } catch (error) {
        console.error("Failed to fetch responsibilities:", error);
      }
    };
    fetchData();


  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    
    if (name === "workingHours") {
      const numValue = Number(value);
      let formattedValue;
      
      if (e.target.id === "workingHoursManual") {
        formattedValue = (numValue / 60).toFixed(2);
      } else {
        formattedValue = (numValue / 60).toFixed(2);
      }
      
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (responsibilities?.functions?.length === 1){
      setFormData(
        {
          ...formData,
          func_id: Number(responsibilities.functions[0].funcId),
        }
      )
    }   
    else if (responsibilities?.nonCompulsory?.length === 1){
      setFormData(
        {
          ...formData,
          deputy_id: responsibilities.nonCompulsory[0].deputyId,
        }
      )
    }    
    console.log(formData,responsibilities.functions.length,"then")
    if (responsibilities?.length) {
      console.log("No tasks available for report");
      alert("Нет доступных задач для отчета");
      return;
    }

    if (!formData.func_id && !formData.deputy_id) {
      
      console.log("No task selected", formData);
      alert("Выберите задачу");
      
      return;
    }

    if (Number(formData.workingHours) <= 0) {
      console.log("Invalid working hours:", formData.workingHours);
      alert("Укажите корректное количество часов");
      return;
    }

    setLoading(true);
    try {
      if(type === "main"){
        const reportData = {
          func_id: formData.func_id,
          workingHours: Number(formData.workingHours),
          comment: formData.comment,
        };
        const req = await sendReport(reportData);
        if (req) {
          alert("Успешно ");
          router.push("/profile");
        } else {
          alert("Ошибка ");
        }
      }
      else {
        const reportData = {
          deputy_id: formData.deputy_id,
          workingHours: Number(formData.workingHours),
          comment: formData.comment,
        };
        const req = await sendReport(reportData);
        if (req) {
          alert("Успешно");
          router.push("/profile");
        } else {
          alert("Ошибка ");
        }
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Ошибка при отправке отчета");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (hoursDecimal: number) => {
    const totalMinutes = Math.round(hoursDecimal * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} ч ${minutes} мин`;
  };

  return (
    <div className="mainProfileDiv">
      <Header title="Заполнение отчета" showPanel={false} />
      <main className="container mx-auto p-4 flex-grow">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto mt-6 bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <h1 className="text-center text-gray-300 text-2xl font-bold mb-6">
            Заполнение отчета
          </h1>

          <div className="mb-4">
            <label htmlFor="type" className="block text-gray-300 mb-2">
              Выберите Тип
              </label>
            <select
            id="type"
            value={type}
            onChange={(e) => {
              settype(e.target.value);
              if(e.target.value === "ext" && responsibilities.nonCompulsory.length > 0) {
                setFormData(prev => ({
                  ...prev,
                  deputy_id: responsibilities.nonCompulsory[0].deputyId,
                  func_id: 0
                }));
              } else if(e.target.value === "main" && responsibilities.functions.length > 0) {
                setFormData(prev => ({
                  ...prev,
                  func_id: responsibilities.functions[0].funcId,
                  deputy_id: 0
                }));
              }
            }}  
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
            >
              
<option value={
"main"
}>
  Основная
</option>
<option value={
  "ext"
}>
  Дополнительная
</option>
          
            </select>
            <label htmlFor="tf_id" className="block text-gray-300 mb-2">
              Выберите обязанность
            </label>
            
              {
                type === "main" ? 
                <select
              id="tf_id"
              value={formData.func_id || formData.deputy_id || ""}
              onChange={
                (e) => {
              
                    setFormData({
                      ...formData,
                      func_id: Number(e.target.value)
                    })
                    console.log(formData)
                  
  
                console.log(formData)
              }
            }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
                <optgroup label="Основные функции" className="bg-red-500">
                {responsibilities?.functions?.map((func) => (
                  <option key={func.funcName} value={func.funcId}>
                    {func.funcName}
                  </option>
                ))}
              </optgroup>
              </select>
              :
              <select
              id="tf_id"
              value={ formData.deputy_id }
              onChange={(e)=>{
                setFormData((prev) => ({
                  ...prev,
                  deputy_id: Number(e.target.value)
                }));
                console.log(formData,'dep')
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
                <optgroup label="Дополнительные обязанности" className="bg-green-500">
                {responsibilities?.nonCompulsory?.map((duty: { deputyId: number; deputyName: string; }) => (
                  <option key={duty.deputyId} value={duty.deputyId}>
                    {duty.deputyName}
                  </option>
                ))}
              </optgroup>
              </select>
              }
             
          
          </div>          <div className="mb-4">
            <label className="block mb-1">Количество выполненных часов</label>
            <div className="flex flex-col items-center">
              <input
                type="range"
                id="workingHoursSlider"
                name="workingHours"
                min="5"
                max="480"
                step="5"
                value={Math.round(Number(formData.workingHours) * 60)}
                onChange={handleChange}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer my-2"
              />
              <div className="mt-2 text-xl font-bold select-none">
                {formatTime(Number(formData.workingHours))}
              </div>
            </div>

            {/* <div className="flex flex-col ">
              <label className="block mb-1 items-start">Ввод в ручную (минуты)</label>
              <input
                type="number"
                id="workingHoursManual"
                name="workingHours"
                value={Math.round(Number(formData.workingHours) * 60)}
                min="5"
                max="480"
                onChange={handleChange}
                className="emailInputStyles"
              />
            </div> */}
          </div>

          <div className="mb-6">
            <label htmlFor="comment" className="block text-gray-300 mb-2">
              Комментарий
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Опишите выполненную работу (опционально)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Отправка..." : "Отправить отчет"}
          </button>
        </form>
      </main>
      <UniversalFooter />
    </div>
  );
}