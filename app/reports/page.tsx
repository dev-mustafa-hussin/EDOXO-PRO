"use client";

import { useEffect, useState } from "react";
import { useSaleStore } from "@/store/sale-store";
import { usePurchaseStore } from "@/store/purchase-store";
import { useProductStore } from "@/store/product-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Calendar,
} from "lucide-react";

export default function ReportsPage() {
  const { sales, fetchSales } = useSaleStore();
  const { purchases, fetchPurchases } = usePurchaseStore();
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchSales();
    fetchPurchases();
    fetchProducts();
  }, [fetchSales, fetchPurchases, fetchProducts]);

  // key Metrics
  const totalRevenue = sales.reduce((acc, sale) => acc + sale.grandTotal, 0);
  const totalCost = purchases.reduce(
    (acc, purchase) => acc + purchase.grandTotal,
    0
  );
  const netProfit = totalRevenue - totalCost;

  // Inventory Value (Cost Price * Quantity)
  const inventoryValue = products.reduce(
    (acc, product) => acc + product.purchasePrice * product.currentStock,
    0
  );
  const inventoryCount = products.reduce(
    (acc, product) => acc + product.currentStock,
    0
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          التقارير والتحليلات 📊
        </h1>
        <div className="text-sm text-gray-500">
          <span className="font-bold">تاريخ اليوم:</span>{" "}
          {new Date().toLocaleDateString("ar-EG")}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              صافي الربح
            </CardTitle>
            <TrendingUp
              className={`w-4 h-4 ${
                netProfit >= 0 ? "text-green-500" : "text-red-500"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                netProfit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {netProfit.toLocaleString()} EGP
            </div>
            <p className="text-xs text-gray-500 mt-1">المبيعات - المشتريات</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              إجمالي المبيعات
            </CardTitle>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalRevenue.toLocaleString()} EGP
            </div>
            <p className="text-xs text-gray-500 mt-1">{sales.length} فاتورة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              إجمالي المشتريات
            </CardTitle>
            <TrendingDown className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {totalCost.toLocaleString()} EGP
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {purchases.length} فاتورة شراء
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              قيمة المخزون
            </CardTitle>
            <Package className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {inventoryValue.toLocaleString()} EGP
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {inventoryCount} قطعة بالمخزن
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Details */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="sales">تفاصيل المبيعات</TabsTrigger>
          <TabsTrigger value="inventory">تفاصيل المخزون</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>أحدث العمليات</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-right">النوع</th>
                    <th className="py-2 text-right">المرجع</th>
                    <th className="py-2 text-right">المبلغ</th>
                    <th className="py-2 text-right">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ...sales.map((s) => ({ ...s, type: "بيع" })),
                    ...purchases.map((p) => ({ ...p, type: "شراء" })),
                  ]
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .slice(0, 5) // Last 5 transactions
                    .map((item, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              item.type === "بيع"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>
                        <td className="py-2">{item.invoiceNumber}</td>
                        <td className="py-2 font-bold">
                          {item.grandTotal.toLocaleString()}
                        </td>
                        <td className="py-2">{item.date}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>سجل المبيعات اليومي</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">
                يعرض هذا الجدول جميع حركات البيع المسجلة.
              </p>
              {/* Simplified Table for MVP */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-right">رقم الفاتورة</th>
                      <th className="p-3 text-right">العميل</th>
                      <th className="p-3 text-right">المبلغ</th>
                      <th className="p-3 text-right">التاريخ</th>
                      <th className="p-3 text-right">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale) => (
                      <tr key={sale.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">
                          {sale.invoiceNumber}
                        </td>
                        <td className="p-3">{sale.customerName}</td>
                        <td className="p-3 text-green-600 font-bold">
                          {sale.grandTotal.toLocaleString()}
                        </td>
                        <td className="p-3">{sale.date}</td>
                        <td className="p-3">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            {sale.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>تحليل المخزون</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        شراء: {product.purchasePrice} | بيع:{" "}
                        {product.sellingPrice}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`block text-lg font-bold ${
                          product.currentStock > 0
                            ? "text-blue-600"
                            : "text-red-500"
                        }`}
                      >
                        {product.currentStock}
                      </span>
                      <span className="text-xs text-gray-400">قطعة</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
