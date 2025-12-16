"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tag, Plus, Loader2 } from "lucide-react";
import { ExpenseService, ExpenseCategory } from "@/services/expense-service";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const categorySchema = z.object({
  name: z.string().min(1, "اسم الفئة مطلوب"),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function ExpenseCategoriesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await ExpenseService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      await ExpenseService.createCategory(data);
      toast.success("تم إضافة الفئة بنجاح");
      reset();
      setIsDialogOpen(false);
      loadCategories();
    } catch (error) {
      toast.error("فشل إضافة الفئة");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>الرئيسية</span>
            <span>/</span>
            <span>المصاريف</span>
            <span>/</span>
            <span className="text-blue-600">فئات المصاريف</span>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Tag className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-800">
                فئات المصاريف
              </h1>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                  <Plus className="w-4 h-4" />
                  أضف فئة
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة فئة مصروف جديدة</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label>اسم الفئة</Label>
                    <Input
                      {...register("name")}
                      placeholder="مثال: كهرباء، رواتب..."
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>وصف (اختياري)</Label>
                    <Input
                      {...register("description")}
                      placeholder="وصف للفئة..."
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      ) : null}
                      حفظ
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b text-right">
                  <th className="p-3 font-medium text-gray-600">ID</th>
                  <th className="p-3 font-medium text-gray-600">الاسم</th>
                  <th className="p-3 font-medium text-gray-600">الوصف</th>
                  <th className="p-3 font-medium text-gray-600">
                    تاريخ الإضافة
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-400">
                      لا توجد فئات مضافة
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{cat.id}</td>
                      <td className="p-3 font-medium">{cat.name}</td>
                      <td className="p-3 text-gray-500">
                        {cat.description || "-"}
                      </td>
                      <td className="p-3">
                        {cat.createdAt
                          ? new Date(cat.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
