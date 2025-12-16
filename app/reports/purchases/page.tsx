"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportService } from "@/services/report-service";
import { Loader2, TrendingUp, ShoppingCart, DollarSign } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PurchasesReportPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await ReportService.getPurchases();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch purchases report", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <span>التقارير</span>
            <span>/</span>
            <span className="text-blue-600">تقرير المشتريات</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            تقرير المشتريات (الشهر الحالي)
          </h1>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      إجمالي المشتريات
                    </CardTitle>
                    <DollarSign className="w-4 h-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Number(data.total_purchases).toLocaleString()} ر.س
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      عدد الفواتير
                    </CardTitle>
                    <ShoppingCart className="w-4 h-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {data.purchases_count}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>المشتريات اليومية</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.daily_purchases}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="total" fill="#ef4444" name="المشتريات" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              لا توجد بيانات
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
