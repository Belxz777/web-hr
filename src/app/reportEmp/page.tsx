'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PulseLogo } from '@/svgs/Logo'
import { useTasks } from '@/hooks/useTasks'
import { useState } from 'react'
import React from 'react'
import FormEmpl from '@/components/buildIn/form_empl'
import ReportEmpl from '@/components/buildIn/ReportEmpl'
const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")


  return (
    <main className='inline-grid grid-cols-[12fr_1fr]'>
    <div className="grid grid-cols-3 gap-4 w-[70%]">
                <div className=''> 
                <p className='flex justify-center h-[40px] text-xl py-2 px-4 font-medium text-gray-200'
                 >Выберите сотрудника</p>
             <FormEmpl/>
                </div>

                <div className=''>
                <p className='flex justify-center h-[40px]   text-xl py-2 px-4 font-medium text-gray-200'
                 >Выберите начало дат</p>
                <input type='date'  id="StartDate"  className='flex justify-center h-[45px]  w-[280px]  text-lg py-2 px-4 border border-gray-600 rounded-xl shadow-sm  font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                 >
                </input>
                
                </div>

                <div className=''>
                <p className='flex justify-center h-[40px] text-xl py-2 px-4 font-medium text-gray-200'
                 >Выберите конец дат</p>
                <input type='date'  id="endDate" className='flex justify-center h-[45px]  w-[280px]  text-lg py-2 px-4 border border-gray-600 rounded-xl shadow-sm  font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                 >
                </input>
                
                </div>

    </div>
    <div className='flex justify-end mr-[30px]'>

                <div className='inline-grid my-[30px]'>

                <button className=' flex justify-center h-[45px] w-[200px] text-lg py-2 px-4 border border-gray-600 rounded-xl shadow-sm  font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                 > <h1 className='m-auto'>Применить</h1>
                </button>
                </div>
              

    </div>
    </main>
  );
}

export default function ProfilePage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

const isPosX = localStorage.getItem('lc-pos-x') === 'true'
  return (
    
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 text-gray-100">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className=' inline-flex items-center '> 
          <PulseLogo className="w-16 h-16 text-red-600 animate-pulse" />
          <h1 className="text-2xl  pl-4 font-bold">Отчёты</h1>  
          </div>
        <div className="relative">
            
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-300 hover:text-white focus:outline-none"
          >
            <span className="sr-only">Открыть меню</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-lg py-1">              {
  localStorage.getItem('lc-dep-x') ?
<>
<Link href={`/d`} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Глобальная информация</Link>

</>
:
<Link href="/report" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Заполнение отчета</Link>
  }
              <Link href="/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Настройки</Link>              <p className="block px-4 py-2 text-sm text-gray-300 hover:bg-red-600 select-none">{new Date().toLocaleTimeString()}</p>
            </div>
          )}
        </div>
      </header>
      <section className="h-[60px] mt-2 ml-5">
        <ComboboxDemo/>
{/* Разобраться с ReportEmpl */}
      <div className="mt-[20px] grid grid-cols-[40%_30%_10%_20%] h-[40px] w-[98%]  text-lg py-2 px-4 border border-gray-600 rounded-xl shadow-sm  font-medium text-gray-300 bg-gray-700"> 
        <p className='text-lg font-medium text-gray-200'> Сотрудник 1</p> {/* Сделать UseState с сотрудниками */}
        <p className=' text-lg pl-[20px] border-l-[1px] border-[#fff] font-medium text-gray-200'> Принести чай</p> {/* Сделать UseState с задачами */}
        <p className=' text-lg  pl-[20px] border-l-[1px] border-[#fff]  font-medium text-gray-200'> 20.01.2025</p> {/* Сделать UseState с датами */}
        <button className='text-lg  pl-[20px] border-l-[1px] border-[#fff] font-medium text-gray-200'> <img className='inline-grid' src='install.svg'/> <h1 className='inline-grid'>скачать</h1> </button> {/* Сделать UseState с датами */}
        </div>
        

      </section>


    </div>
  );
}



