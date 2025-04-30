"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

interface TimeInputProps {
  name: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  initialHours?: number
  initialMinutes?: number
}

export default function TimeInput({ onChange, name, initialHours = 0, initialMinutes = 0 }: TimeInputProps) {
  const [hours, setHours] = useState<number>(initialHours)
  const [minutes, setMinutes] = useState<number>(initialMinutes)
  const [progress, setProgress] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const svgRef = useRef<SVGSVGElement>(null)

  // Convert hours and minutes to decimal time and update progress
  useEffect(() => {
    const totalMinutes = hours * 60 + minutes
    const syntheticEvent = {
      target: {
        name,
        value: totalMinutes.toString(),
        id: "workingHoursManual"
      }
    } as React.ChangeEvent<HTMLInputElement>
    
    onChange(syntheticEvent)

    // Calculate progress for the circle (based on 24 hour clock)
    const progressPercentage = (totalMinutes / (24 * 60)) * 100
    setProgress(progressPercentage)
  }, [hours, minutes, onChange, name])

  // Update time based on progress
  const updateTimeFromProgress = (newProgress: number) => {
    // Ensure progress is between 0 and 100
    newProgress = Math.max(0, Math.min(100, newProgress))
    setProgress(newProgress)

    // Calculate total minutes based on progress (24 hour clock)
    const totalMinutes = (newProgress / 100) * 24 * 60

    // Convert to hours and minutes
    const newHours = Math.floor(totalMinutes / 60)
    const newMinutes = Math.round(totalMinutes % 60)

    setHours(newHours)
    setMinutes(newMinutes)
  }

  // Handle mouse/touch events for dragging
  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (!isDragging || !svgRef.current) return

    let clientX: number, clientY: number

    if ("touches" in e) {
      // Touch event
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      // Mouse event
      clientX = e.clientX
      clientY = e.clientY
    }

    const svgRect = svgRef.current.getBoundingClientRect()
    const centerX = svgRect.left + svgRect.width / 2
    const centerY = svgRect.top + svgRect.height / 2

    // Calculate angle from center to mouse position
    const angle = Math.atan2(clientY - centerY, clientX - centerX)

    // Convert angle to degrees and adjust to start from top (0 degrees)
    let degrees = (angle * 180) / Math.PI + 90
    if (degrees < 0) degrees += 360

    // Convert degrees to progress percentage
    const newProgress = (degrees / 360) * 100
    updateTimeFromProgress(newProgress)
  }

  // Handle hours input change
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value >= 0 && value < 24) {
      setHours(value)
    } else if (e.target.value === "") {
      setHours(0)
    }
  }

  // Handle minutes input change
  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value >= 0 && value < 60) {
      setMinutes(value)
    } else if (e.target.value === "") {
      setMinutes(0)
    }
  }

  // Calculate the coordinates for the circle indicator
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  // Add event listeners for document to handle dragging outside the SVG
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener("mouseup", handleGlobalMouseUp)
    document.addEventListener("touchend", handleGlobalMouseUp)

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp)
      document.removeEventListener("touchend", handleGlobalMouseUp)
    }
  }, [])

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative w-32 h-32">
        {/* Circle background */}
        <svg
          ref={svgRef}
          className="w-full h-full cursor-pointer"
          viewBox="0 0 120 120"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          onTouchMove={handleMouseMove}
        >
          <circle cx="60" cy="60" r={radius} fill="transparent" stroke="#e5e7eb" strokeWidth="8" />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="#0ea5a5"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
          {/* Indicator dot */}
          <circle
            cx={60 + radius * Math.cos((2 * Math.PI * progress) / 100 - Math.PI / 2)}
            cy={60 + radius * Math.sin((2 * Math.PI * progress) / 100 - Math.PI / 2)}
            r="6"
            fill="#0ea5a5"
            className="cursor-grab"
          />
        </svg>

        {/* Time display in the center */}
        <div className="absolute inset-0 flex items-center justify-center text-lg font-medium">
          {hours}ч {minutes}м
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex flex-col">
          <label htmlFor="hours" className="text-sm text-gray-600 mb-1">
            Часы
          </label>
          <input
            id="hours"
            type="number"
            min="0"
            max="23"
            value={hours}
            onChange={handleHoursChange}
            className="w-20 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="minutes" className="text-sm text-gray-600 mb-1">
            Минуты
          </label>
          <input
            id="minutes"
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={handleMinutesChange}
            className="w-20 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>
    </div>
  )
}
