"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useRef, useState } from "react"
import Canva from "./Canva"

const dataIt = [
  {
    department: "Выполнено",
    value: 85,
  },
  {
    department: "В процессе",
    value: 5,
  },
  {
    department: "Не начато",
    value: 10,
  },
]
const dataDis = [
  {
    department: "Выполнено",
    value: 50,
  },
  {
    department: "В процессе",
    value: 10,
  },
  {
    department: "Не начато",
    value: 40,
  },
]
const dataMen = [
  {
    department: "Выполнено",
    value: 10,
  },
  {
    department: "В процессе",
    value: 40,
  },
  {
    department: "Не начато",
    value: 50,
  },
]

export default function TaskChart() {
  

  return (
    <div>
      <div className="">

      <div className="grid grid-cols-3 gap-4">
      <Canva data={dataIt}/>
      <Canva data={dataDis}/>
      <Canva data={dataMen}/>
      </div>
      </div>

    </div>
  )
}

