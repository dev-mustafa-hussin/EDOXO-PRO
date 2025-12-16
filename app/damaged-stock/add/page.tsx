"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { DamagedStockService } from "@/services/damaged-stock-service";
import { WarehouseService, Warehouse } from "@/services/warehouse-service";
import { ProductService, Product } from "@/services/product-service";
import { useRouter } from "next/navigation";

const damagedStockSchema = z.object({
  date: z.string().min(1, "التاريخ مطلوب"),
  warehouseId: z.string().min(1, "المستودع مطلوب"),
  productId: z.string().min(1, "المنتج مطلوب"),
  quantity: z
    .string()
    .min(1, "الكمية مطلوبة")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "يجب أن تكون الكمية رقمًا صحيحًا اكبر من 0"
    ),
  reason: z.string().optional(),
});

type DamagedStockFormValues = z.infer<typeof damagedStockSchema>;

export default function AddDamagedStockPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DamagedStockFormValues>({
    resolver: zodResolver(damagedStockSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [whs, prods] = await Promise.all([
          WarehouseService.getAll(),
          ProductService.getAll(),
        ]);
        setWarehouses(whs);
        setProducts(prods);
      } catch (error) {
        console.error("Failed to load initial data", error);
        toast.error("فشل تحميل البيانات");
      }
    };
    loadData();
  }, []);

  const onSubmit = async (data: DamagedStockFormValues) => {
    try {
      setIsLoading(true);
      await DamagedStockService.create({
        ...data,
        quantity: Number(data.quantity),
        warehouseId: Number(data.warehouseId),
        productId: Number(data.productId),
      });
      toast.success("تم تسجيل التالف بنجاح");
      router.push("/damaged-stock/list");
    } catch (error) {
      console.error("Failed to create damaged stock", error);
      toast.error("فشل تسجيل التالف");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenCalculator={() => {}}
        onOpenProfit={() => {}}
      />
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>الرئيسية</span>
            <span>/</span>
            <span>المخزون التالف</span>
            <span>/</span>
            <span className="text-blue-600">أضف تالف</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Trash2 className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              تسجيل مخزون تالف
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>تاريخ التسجيل</Label>
                  <Input type="date" {...register("date")} />
                  {errors.date && (
                    <p className="text-red-500 text-sm">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>المستودع</Label>
                  <Select onValueChange={(val) => setValue("warehouseId", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المستودع" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((wh) => (
                        <SelectItem key={wh.id} value={wh.id.toString()}>
                          {wh.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.warehouseId && (
                    <p className="text-red-500 text-sm">
                      {errors.warehouseId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>المنتج</Label>
                  <Select onValueChange={(val) => setValue("productId", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المنتج" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((prod) => (
                        <SelectItem key={prod.id} value={prod.id.toString()}>
                          {prod.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.productId && (
                    <p className="text-red-500 text-sm">
                      {errors.productId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>الكمية التالفة</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    {...register("quantity")}
                  />
                  {errors.quantity && (
                    <p className="text-red-500 text-sm">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>سبب التلف / ملاحظات</Label>
                <Input
                  {...register("reason")}
                  className="h-20"
                  placeholder="وصف السبب..."
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto px-8"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  ) : null}
                  حفظ
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
