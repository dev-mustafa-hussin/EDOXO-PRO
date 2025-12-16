"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportService } from "@/services/report-service";
import { Loader2, Package, AlertTriangle, IndianRupee } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function StockReportPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await ReportService.getStock();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch stock report", error);
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
            <span className="text-blue-600">تقرير المخزون</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            تحليل المخزون
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
                      قيمة المخزون التقديرية (سعر البيع)
                    </CardTitle>
                    <IndianRupee className="w-4 h-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Number(data.total_stock_value).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      إجمالي المنتجات
                    </CardTitle>
                    <Package className="w-4 h-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {data.total_products}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      منتجات منخفضة المخزون
                    </CardTitle>
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {data.low_stock_products.length}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      أقل من 10 قطع
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Distribution Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>توزيع المنتجات حسب التصنيف</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.category_distribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="count"
                          nameKey="name"
                        >
                          {data.category_distribution.map(
                            (entry: any, index: number) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Low Stock List */}
                <Card>
                  <CardHeader>
                    <CardTitle>تنبيهات انخفاض المخزون</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                      {data.low_stock_products.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                          المخزون جيد، لا توجد تنبيهات.
                        </p>
                      ) : (
                        data.low_stock_products.map((product: any) => (
                          <div
                            key={product.id}
                            className="flex justify-between items-center bg-red-50 p-2 rounded border border-red-100"
                          >
                            <span className="font-medium text-gray-700">
                              {product.name}
                            </span>
                            <span className="font-bold text-red-600">
                              {product.current_stock} قطعة
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
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
