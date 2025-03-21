"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import sendUserLoginData from "@/components/server/login";
import { useState } from "react";
import "@/app/globals.css";
import { PulseLogo } from "@/svgs/Logo";
import { useUserStore } from "@/store/userStore";

export default function Home() {
  const { setIsBoss } = useUserStore();
  const router = useRouter();
  const schema = z.object({
    login: z.string().min(6, "Логин должен содержать минимум 6 символов"),
    password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  });

  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<{ status: boolean; text: string }>({
    status: false,
    text: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      login: login || "",
      password: password || "",
    };
    setLoading(true);
    setError({
      status: false,
      text: "",
    });

    try {
      const resultData = await sendUserLoginData(data);

      if (!resultData) {
        setLoading(false);
        setError({
          status: true,
          text: "Ошибка аутентификации пользователя",
        });
        return;
      }

      setIsBoss(resultData.isBoss); 

      localStorage.setItem("lc-pos-x", resultData.isBoss);
      if (resultData.isBoss) {
        localStorage.setItem("lc-dep-x", resultData.departmentId);
      }

      router.push("/profile");
    } catch (err: any) {
      console.log(err);
      setError({
        status: true,
        text: "Не удалось выполнить вход, попробуйте снова.",
      });
      setShowPopup(true);
      setTimeout(() => setIsPopupVisible(true), 50);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="divWrapper">
      <main className="mainWrapper">
        <header className="flex flex-col items-center">
          <PulseLogo className="pulseLogo" />
          <h1 className="textH1">Вход</h1>
        </header>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="login" className="labelStyles">
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
              className="emailInputStyles"
              placeholder="Введите логин"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="labelStyles">
              Пароль
            </label>
            <div className="mt-1 relative rounded-xl shadow-sm">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="passwordInputStyles"
                placeholder="********"
              />
              <button
                type="button"
                className="redButtonStyles"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                <svg
                  className="svgStyles"
                  fill="#fff"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  stroke="currentColor"
                >
                  {showPassword ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="submitButtonStyles"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Вход...
                </>
              ) : (
                "Войти"
              )}
            </button>
          </div>
        </form>
      </main>
      <footer className="footerAuthStyles">
        <p>
          Нет аккаунта?{" "}
          <Link href="/register" className="linkStyles">
            Зарегистрироваться
          </Link>
        </p>
      </footer>

      {showPopup && (
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
            isPopupVisible ? "bg-opacity-50" : "bg-opacity-0"
          } flex items-center justify-center`}
        >
          <div
            className={`bg-gray-800 p-6 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out ${
              isPopupVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <h2 className="svgStyles">Ошибка</h2>
            <p className="error">{error.text}</p>
            <button
              onClick={() => {
                setIsPopupVisible(false);
                setTimeout(() => setShowPopup(false), 300);
              }}
              className="closePopUpStyles"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
