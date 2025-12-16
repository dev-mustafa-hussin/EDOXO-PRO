"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRightLeft, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  StockTransfer,
  StockTransferService,
} from "@/services/stock-transfer-service";

export default function StockTransfersPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [transfers, setTransfers] = useState<StockTransfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTransfers = async () => {
      try {
        const data = await StockTransferService.getAll();
        setTransfers(data);
      } catch (error) {
        console.error("Failed to fetch transfers", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTransfers();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            مكتمل
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            قيد الانتظار
          </Badge>
        );
      case "sent":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            تم الإرسال
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <span>الرئيسية</span>
            <span>/</span>
            <span className="text-blue-600">تحويلات المخزون</span>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <ArrowRightLeft className="w-6 h-6 text-blue-600" />
              تحويلات المخزون
            </h1>
            <Link href="/stock-transfers/add">
              <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Plus className="w-4 h-4" />
                تحويل جديد
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-gray-50">
                  <tr className="border-b text-right">
                    <th className="p-3 font-medium text-gray-600">التاريخ</th>
                    <th className="p-3 font-medium text-gray-600">
                      رقم المرجع
                    </th>
                    <th className="p-3 font-medium text-gray-600">من مستودع</th>
                    <th className="p-3 font-medium text-gray-600">
                      إلى مستودع
                    </th>
                    <th className="p-3 font-medium text-gray-600">المجموع</th>
                    <th className="p-3 font-medium text-gray-600">الحالة</th>
                    <th className="p-3 font-medium text-gray-600">خيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8">
                        <div className="flex justify-center">
                          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                        </div>
                      </td>
                    </tr>
                  ) : transfers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-8 text-gray-400"
                      >
                        لا توجد تحويلات مخزون متاحة
                      </td>
                    </tr>
                  ) : (
                    transfers.map((transfer) => (
                      <tr
                        key={transfer.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3">{transfer.date}</td>
                        <td className="p-3 font-medium">{transfer.refNo}</td>
                        <td className="p-3">{transfer.fromWarehouse?.name}</td>
                        <td className="p-3">{transfer.toWarehouse?.name}</td>
                        <td className="p-3">
                          {transfer.items?.length || 0} صنف
                        </td>
                        <td className="p-3">
                          {getStatusBadge(transfer.status)}
                        </td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm">
                            <FileText className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
