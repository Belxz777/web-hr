"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import sendUserLoginData from "@/components/server/login";
import { useState } from "react";
import "@/app/globals.css";
import { PulseLogo } from "@/svgs/Logo";
import { send } from "process";






export default function Home() {
    const router = useRouter();
    const schema = z.object({
        login: z.string().min(6, "Логин должен содержать минимум 6 символов"),
        password: z
            .string()
            .min(6, "Пароль должен содержать минимум 6 символов"),
    });

    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [showPopup, setShowPopup] = useState(false)
    const [isPopupVisible, setIsPopupVisible] = useState(false)
    const [error, setError] = useState<{ status: boolean; text: string }>({
        status: false,
        text: "",
    });

    // const sendData = async () => {
    //     setLoading(true);

    //     const data = {
    //         login: login || "",
    //         password: password || "",
    //     };

    //     const result = schema.safeParse(data);

    //     if (!result.success) {
    //         setLoading(false);
    //         setError({
    //             status: true,
    //             text: result.error.issues[0].message,
    //         });
    //         console.error(result.error.message);

    //         return;
    //     }
    //     try {
    //         const resultData = await sendUserLoginData(data);

    //         if (!resultData) {
    //             setLoading(false);
    //             setError({
    //                 status: true,
    //                 text: "Ошибка аутентификации пользователя",
    //             });
    //             return;
    //         }
            
    //         router.push("/profile");
    //         localStorage.setItem("userData", JSON.stringify(resultData));
    //     } catch (error) {
    //         setLoading(false);
    //         setError({
    //             status: true,
    //             text: "Не удалось выполнить вход, попробуйте снова.",
    //         });
    //     }
    // };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = {
            login: login || "",
            password: password || "",
        };
        setLoading(true)
        setError(
    {
                status: false,
                text: "",
            }
        );
        
    try{
        const resultData = await sendUserLoginData(data);

            if (!resultData) {
                setLoading(false);
                setError({
                    status: true,
                    text: "Ошибка аутентификации пользователя",
                });
                return;
            }
            
            router.push("/profile");
        } 
         catch (err) {
          setError({
            status: true,
            text: 'Неверный логин или пароль',
          })
          setShowPopup(true)
          setTimeout(() => setIsPopupVisible(true), 50)
        } finally {
          setLoading(false)
        }
      }
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 flex flex-col items-center justify-center p-4">
        <main className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full space-y-8">
          <header className="flex flex-col items-center">
            <PulseLogo className="w-16 h-16 text-red-600" />
            <h1 className="mt-4 text-3xl font-bold text-gray-100">Вход в Пульс</h1>
          </header>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-gray-300">
                Логин
              </label>
              <input
                id="email"
                name="login"
                type="text"
                autoComplete="name"
                required
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder=""
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password" 
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="********"
              />
            </div>
            <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Вход...
                </>
              ) : 'Войти'}
            </button>
            </div>
          </form>
        </main>
        <footer className="mt-8 text-center text-gray-400">
          <p>Нет аккаунта?{' '}
            <Link href="/register" className="font-medium text-red-400 hover:text-red-300">
              Зарегистрироваться
            </Link>
          </p>
        </footer>
        
      {showPopup && (
        <div 
          className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
            isPopupVisible ? 'bg-opacity-50' : 'bg-opacity-0'
          } flex items-center justify-center`}
        >
          <div 
            className={`bg-gray-800 p-6 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out ${
              isPopupVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <h2 className="text-xl font-bold text-red-500 mb-4">Ошибка</h2>
            <p className="text-gray-300 mb-4">{error.text}</p>
            <button
              onClick={() => {
                setIsPopupVisible(false)
                setTimeout(() => setShowPopup(false), 300)
              }}
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
      </div>
    );
}