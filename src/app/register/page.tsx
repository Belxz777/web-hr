"use client";
import React, { useEffect, useState } from "react";
import { PulseLogo } from "@/svgs/Logo";
import Link from "next/link";


    //TODO добавить департамент и загругку
    const jobs = [
      { id: 1, title: 'Разработчик' },
      { id: 2, title: 'Дизайнер' },
      { id: 3, title: 'Менеджер' },
    ]
    
    const departments = [
      { id: 1, name: 'IT отдел' },
      { id: 2, name: 'Отдел дизайна' },
      { id: 3, name: 'Отдел продаж' },
    ]
    
    export default function RegisterPage() {
      const [formData, setFormData] = useState({
        login: "",
        password: "",
        first_name: "",
        last_name: "",
        father_name: "",
        jobId: 0,
        age: 0,
        departmentId: 0,
      })
    
      const [isLoading, setIsLoading] = useState(false)
      const [error, setError] = useState('')
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
          ...prev,
          [name]: name === 'age' || name === 'jobId' || name === 'departmentId' ? parseInt(value) : value
        }))
      }
    
      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
    
        try {
          // Здесь будет реальная логика регистрации
          await new Promise(resolve => setTimeout(resolve, 2000)) // Имитация запроса к серверу
          console.log('Регистрация:', formData)
          // Здесь должна быть логика обработки успешной регистрации
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Произошла ошибка при регистрации')
        } finally {
          setIsLoading(false)
        }
      }
  //   const schematwo = z.object({
  //       login: z.string().min(6, "Логин должен содержать минимум 6 символов"),
  //       password: z
  //           .string()
  //           .min(6, "Пароль должен содержать минимум 6 символов"),
  //       first_name: z.string().min(1, "Имя обязательно для заполнения"),
  //       last_name: z.string().min(1, "Фамилия обязательна для заполнения"),
  //       father_name: z.string(),
  //       job_title_id: z.number().positive("Выберите работу"),
  //       age: z
  //           .number()
  //           .min(18, "Возраст должен быть от 18")
  //           .max(70, "Возраст должен быть до 70"),
  //       avatar: z.string().optional(),
  //       department_id: z.number().positive("Выберите департамент"),
  //   });

  //   const [data, setdata] = useState({
  //       login: "",
  //       password: "",
  //       first_name: "",
  //       last_name: "",
  //       father_name: "",
  //       job_title_id: 0,
  //       age: 0,
  //       department_id: 0,
  //   });

  //   const [loading, setLoading] = useState<boolean>(false);
  //   const [error, setError] = useState<{ status: boolean; text: string }>({
  //       status: false,
  //       text: "",
  //   });
  //   const router = useRouter();
  //   const [job_title, setjob_title] = useState<Array<jobTitle> | jobTitle>([]);

  //   async function createUser() {
  //       setLoading(true);
  //       const result = schematwo.safeParse(data);
    
  //       if (!result.success) {
  //           setLoading(false);
  //           setError({
  //               status: true,
  //               text: result.error.issues[0].message,
  //           });
  //           return;
  //       }
    
  //       try {
  //           await registerUser(data);
  //           router.push("/login");
  //       } catch (error) {
  //           setLoading(false);
  //           setError({
  //               status: true,
  //               text: "Не удалось выполнить регистрацию. Попробуйте снова.",
  //           });
  //       }
  //   }
    
    
  // useEffect(() => {
  //       const fetchData = async () => {
  //           try {
  //               const isToken = await checkCookie();
  //               if (isToken) {
  //                   router.push("/profile");
  //                   return;
  //               }

  //               const response = await fetchAllTitles();
  //               setjob_title(response);
  //           } catch (error) {
  //               setLoading(false);
  //               setError({
  //                   status: true,
  //                   text: "Не удалось загрузить данные. Попробуйте снова.",
  //               });
  //           }
  //       };
  //       fetchData();
  //   }, [router]);  

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 flex flex-col justify-center p-4">
      <main className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <header className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <PulseLogo className="w-16 h-16 text-red-600" />
            <h1 className="mt-4 mr-6 text-3xl font-bold text-gray-100">Регистрация </h1>
          </header>
          <form onSubmit={handleSubmit} className="w-full md:w-3/4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="login" className="block text-sm font-medium text-gray-300">Логин</label>
                <input
                  id="login"
                  name="login"
                  type="text"
                  required
                  value={formData.login}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">Пароль</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-300">Имя</label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-300">Фамилия</label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="father_name" className="block text-sm font-medium text-gray-300">Отчество</label>
                <input
                  id="father_name"
                  name="father_name"
                  type="text"
                  value={formData.father_name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-300">Возраст</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  required
                  min="18"
                  max="100"
                  value={formData.age || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="jobId" className="block text-sm font-medium text-gray-300">Должность</label>
                <select
                  id="jobId"
                  name="jobId"
                  required
                  value={formData.jobId || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Выберите должность</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>{job.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="departmentId" className="block text-sm font-medium text-gray-300">Отдел</label>
                <select
                  id="departmentId"
                  name="departmentId"
                  required
                  value={formData.departmentId || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Выберите отдел</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Регистрация...
                  </>
                ) : 'Зарегистрироваться'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <footer className="mt-8 text-center text-gray-400">
        <p>Уже есть аккаунт?{' '}
          <Link href="/login" className="font-medium text-red-400 hover:text-red-300">
            Войти
          </Link>
        </p>
      </footer>
    </div>
);
}


