"use client"
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
export default function Home() {
  const router = useRouter()
  // TODO доделать страницу поика
  //TODO сделать проверку на может менять или нет 
  //TODO сделать страницу поиска юзеров доделать цвета
  // !На беке продумать как сделать удаление через месяц
  //* Добавить страницу скачивания отчетности
  //& Перенести логику в hooks и добавить loading везде
  const { data, isLoading, error, AuthUser } = useAuth()
  useEffect(() => {
    AuthUser()
  }, [AuthUser, router])
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48  bg-basic-default min-h-screen">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_550px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none  text-basic-default">
                Управляй бизнес процессами вместе с нами
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Управляй своими проектами, следи за ошибками , управляй сотрудниками  и работай  вместе  с командой в одном месте.
                <span className=" text-xl"> Рабочий Пульс -это ультимативный инструмент для управления бизнес-процессами.</span>
              </p>
            </div>
            <div className="flex w-full max-w-sm flex-col space-y-2">
              <Button
                className="w-full bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
                type="submit"
              >
                <Link href={"/registration"} className="w-full"> Начать</Link>
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Зарегистрируйся для получения дальнейшей информации
              </p>
            </div>
          </div>
          <Image
            alt="Рабочий Пульс"
            className=" select-none mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
            height="310"
            src="/go.png"
            loading="lazy"
            width="550"
          />
        </div>
      </div>
    </section>
  );
}
//для добавления компонента run pnpm dlx shadcn-ui@latest add ... component name