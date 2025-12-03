"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Menu } from "lucide-react"

export function SalesChart() {
  const days = Array.from({ length: 31 }, (_, i) => `${i + 4} Nov 2025`)

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="w-4 h-4 text-gray-400" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-600">EDOXO PRO (BL0001)</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">المبيعات فى آخر 30 يوماً</CardTitle>
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48 relative">
          <div className="absolute left-0 top-0 text-xs text-gray-400">أعلى المبيعات EGP</div>
          <div className="absolute left-0 bottom-0 text-xs text-gray-400">0</div>
          <div className="flex items-end justify-between h-full pt-6 pb-4">
            {days.map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <div className="w-2 h-1 bg-blue-200 rounded-full"></div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t border-dashed border-gray-200"></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2 overflow-x-auto">
          {Array.from({ length: 30 }, (_, i) => (
            <span key={i} className="transform -rotate-45 whitespace-nowrap text-[10px]">
              {i + 4} Nov 2025
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
