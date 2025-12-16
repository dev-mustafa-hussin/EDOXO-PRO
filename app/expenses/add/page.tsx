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
import { DollarSign, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ExpenseService, ExpenseCategory } from "@/services/expense-service";
import { WarehouseService, Warehouse } from "@/services/warehouse-service";
import { useRouter } from "next/navigation";

const expenseSchema = z.object({
  date: z.string().min(1, "التاريخ مطلوب"),
  categoryId: z.string().min(1, "فئة المصروف مطلوبة"),
  warehouseId: z.string().optional(),
  amount: z
    .string()
    .min(1, "المبلغ مطلوب")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "يجب أن يكون المبلغ رقمًا صحيحًا اكبر من 0"
    ),
  notes: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

export default function AddExpensePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, whs] = await Promise.all([
          ExpenseService.getCategories(),
          WarehouseService.getAll(),
        ]);
        setCategories(cats);
        setWarehouses(whs);
      } catch (error) {
        console.error("Failed to load initial data", error);
        toast.error("فشل تحميل البيانات");
      }
    };
    loadData();
  }, []);

  const onSubmit = async (data: ExpenseFormValues) => {
    try {
      setIsLoading(true);
      await ExpenseService.create({
        ...data,
        amount: Number(data.amount),
        warehouseId: data.warehouseId ? Number(data.warehouseId) : null,
        categoryId: Number(data.categoryId),
      });
      toast.success("تم إضافة المصروف بنجاح");
      router.push("/expenses/list");
    } catch (error) {
      console.error("Failed to create expense", error);
      toast.error("فشل إضافة المصروف");
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
            <span>المصاريف</span>
            <span>/</span>
            <span className="text-blue-600">أضف مصروف</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              إضافة مصروف جديد
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>التاريخ</Label>
                  <Input type="date" {...register("date")} />
                  {errors.date && (
                    <p className="text-red-500 text-sm">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>فئة المصروف</Label>
                  <Select onValueChange={(val) => setValue("categoryId", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className="text-red-500 text-sm">
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>للمستودع / الفرع (اختياري)</Label>
                  <Select onValueChange={(val) => setValue("warehouseId", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفرع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">بدون تحديد</SelectItem>
                      {warehouses.map((wh) => (
                        <SelectItem key={wh.id} value={wh.id.toString()}>
                          {wh.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>المبلغ</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    {...register("amount")}
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm">
                      {errors.amount.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>ملاحظات</Label>
                <Input
                  {...register("notes")}
                  className="h-20"
                  placeholder="تفاصيل المصروف..."
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
