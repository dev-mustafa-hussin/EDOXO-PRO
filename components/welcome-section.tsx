import { CalendarDays } from "lucide-react"

export function WelcomeSection() {
  return (
    <div className="flex items-center justify-end gap-4 mb-6">
      <div className="text-right">
        <h1 className="text-xl font-semibold text-gray-800">مرحباً محمد مجدى</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarDays className="w-4 h-4" />
          <span>التصفية حسب التاريخ</span>
        </div>
        <p className="text-sm text-gray-400">Wednesday, 03 December 2025</p>
      </div>
      <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center">
        <span className="text-2xl">👋</span>
      </div>
    </div>
  )
}
