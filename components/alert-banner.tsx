"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Info, Sparkles, X } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "urgent",
    message: "عاجل - تنبيه: يرجى مراجعة الفواتير المستحقة لهذا الشهر",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    icon: AlertTriangle,
    iconColor: "text-red-500",
  },
  {
    id: 2,
    type: "new",
    message: "جديد - مرحبا بك في Daftar ERP! اكتشف المميزات الجديدة",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    icon: Sparkles,
    iconColor: "text-blue-500",
    badge: "NEW",
  },
  {
    id: 3,
    type: "info",
    message: "معلومة - نصيحة: قم بأخذ نسخة احتياطية من البيانات بشكل دوري",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-700",
    icon: Info,
    iconColor: "text-yellow-500",
  },
  {
    id: 4,
    type: "urgent",
    message: "عاجل - تنبيه آخر: يرجى مراجعة الفواتير المستحقة",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    icon: AlertTriangle,
    iconColor: "text-red-500",
  },
]

export function AlertBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  const current = notifications[currentIndex]
  const Icon = current.icon

  return (
    <div
      className={`${current.bgColor} ${current.borderColor} border rounded-lg p-3 mb-4 flex items-center justify-between transition-all duration-300`}
    >
      <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-gray-600">
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-3">
        <span className={`text-sm ${current.textColor}`}>{current.message}</span>
        {current.badge && (
          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded font-medium">{current.badge}</span>
        )}
        <Icon className={`w-5 h-5 ${current.iconColor}`} />
      </div>

      {/* Dots indicator */}
      <div className="flex gap-1">
        {notifications.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? "bg-blue-500" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  )
}
