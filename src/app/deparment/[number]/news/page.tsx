'use client'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import News from '@/components/ui/News'
import { Header } from '@/components/ui/header'
import Navigation from '@/components/buildIn/Navigation'
type Props = {}

function page({}: Props) {
  return (
    <div className='bg-main-base'>
    <Header />
    <main className=" w-[180vh] mx-auto px-[2vh] py-[4vh] bg-basic-default shadow-sm">
    <div className="space-y-[1vh]">
      <div className="space-y-[2vh]">
        <h1 className="text-[5vh] font-bold tracking-tight text-basic-default">Новости департамента</h1>
        <p className="text-secondary-default text-[2.8vh]">
          Ознакомьтесь с последними новостями и событиями нашего департамента.
        </p>
      </div>
      <div className="grid gap-[9vh] grid-cols-3   mr-[3.8vh] ">
        <News/>
        <News/>
        <News/>
        <News/>
        <News/>
        <News/>
      </div>
    </div>
  </main>
  </div>
  )
}

export default page