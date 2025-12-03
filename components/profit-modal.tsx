"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface ProfitModalProps {
  open: boolean
  onClose: () => void
}

export function ProfitModal({ open, onClose }: ProfitModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-end">
            <span>الربح اليومي</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div className="text-right">
                <p className="text-sm text-gray-600">إجمالي المبيعات اليوم</p>
                <p className="text-2xl font-bold text-green-600">L.E 0.00</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <TrendingDown className="w-8 h-8 text-red-500" />
              <div className="text-right">
                <p className="text-sm text-gray-600">إجمالي المصروفات اليوم</p>
                <p className="text-2xl font-bold text-red-600">L.E 0.00</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <DollarSign className="w-8 h-8 text-blue-500" />
              <div className="text-right">
                <p className="text-sm text-gray-600">صافي الربح اليوم</p>
                <p className="text-2xl font-bold text-blue-600">L.E 0.00</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center">آخر تحديث: {new Date().toLocaleString("ar-EG")}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
