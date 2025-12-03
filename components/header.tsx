"use client"

import {
  Bell,
  Settings,
  Grid3X3,
  QrCode,
  Calendar,
  Calculator,
  Package,
  CreditCard,
  DollarSign,
  MoreHorizontal,
  PanelRightClose,
} from "lucide-react"

interface HeaderProps {
  onToggleSidebar: () => void
  onOpenCalculator: () => void
  onOpenProfit: () => void
}

export function Header({ onToggleSidebar, onOpenCalculator, onOpenProfit }: HeaderProps) {
  return (
    <header className="bg-[#2563eb] text-white h-12 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-blue-600 rounded transition-colors"
          title="طي/توسيع القائمة"
        >
          <PanelRightClose className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span className="text-sm font-medium">EDOXO PRO</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-blue-600 rounded transition-colors">
          <Grid3X3 className="w-4 h-4" />
        </button>
        <button className="p-2 hover:bg-blue-600 rounded transition-colors">
          <Settings className="w-4 h-4" />
        </button>
        <button className="p-2 hover:bg-blue-600 rounded transition-colors">
          <QrCode className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-sm hover:bg-blue-600 px-2 py-1 rounded cursor-pointer transition-colors">
          <span>نقاط البيع</span>
          <CreditCard className="w-4 h-4" />
        </div>

        <div className="flex items-center gap-2 text-sm hover:bg-blue-600 px-2 py-1 rounded cursor-pointer transition-colors">
          <span>المنتجات</span>
          <Package className="w-4 h-4" />
        </div>

        <button
          onClick={onOpenCalculator}
          className="p-2 hover:bg-blue-600 rounded transition-colors"
          title="آلة حاسبة"
        >
          <Calculator className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenProfit}
          className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 px-3 py-1 rounded transition-colors"
          title="ربح اليوم"
        >
          <DollarSign className="w-4 h-4" />
          <span>الربح اليومي</span>
        </button>

        <div className="flex items-center gap-2 text-sm bg-blue-700 px-3 py-1 rounded">
          <Calendar className="w-4 h-4" />
          <span>12/03/2025</span>
        </div>

        <button className="p-2 hover:bg-blue-600 rounded relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full text-xs flex items-center justify-center text-black font-bold">
            2
          </span>
        </button>

        <button className="p-2 hover:bg-blue-600 rounded transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-sm">
          <div className="w-6 h-6 rounded-full bg-gray-300"></div>
          <span>مرحبا بك في الشركة الموحدة</span>
        </div>
      </div>
    </header>
  )
}
