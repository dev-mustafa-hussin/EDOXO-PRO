"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRightLeft, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { StockTransfer, StockTransferService } from "@/services/stock-transfer-service";

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
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">مكتمل</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">قيد الانتظار</Badge>;
      case "sent":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">تم الإرسال</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 p-6">
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
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400">
                      لا توجد تحويلات مخزون متاحة
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
