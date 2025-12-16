"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Box, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProductService } from "@/services/product-service";
import { toast } from "sonner";

// Define Validation Schema
const productSchema = z.object({
  name: z.string().min(3, "اسم المنتج يجب أن يكون 3 أحرف على الأقل"),
  sku: z.string().min(1, "كود المنتج مطلوب"),
  purchasePrice: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "سعر الشراء يجب أن يكون رقماً موجباً",
    }),
  sellingPrice: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "سعر البيع يجب أن يكون رقماً موجباً",
    }),
  description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      purchasePrice: "",
      sellingPrice: "",
      description: "",
      // currentStock: 0, // backend uses 'stock', we map it in onSubmit
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const payload = {
        name: data.name,
        sku: data.sku,
        cost: Number(data.purchasePrice),
        price: Number(data.sellingPrice),
        description: data.description,
        stock: 0,
        category_id: null,
      };

      await ProductService.create(payload as any);

      // We can use a simple alert for now if toast is complex to integrate without checking
      toast.success("تم إنشاء المنتج بنجاح");
      router.push("/products/list");
    } catch (error) {
      console.error("Failed to create product", error);
      toast.error(
        "فشل إنشاء المنتج. يرجى التأكد من تشغيل الخادم والاتصال بالإنترنت."
      );
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
            <span>المنتجات</span>
            <span>/</span>
            <span className="text-blue-600">أضف منتجا</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Box className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              أضف منتجا جديدا
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="max-w-2xl space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    اسم المنتج <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="اسم المنتج"
                    {...register("name")}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">
                    كود المنتج (SKU) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="sku"
                    placeholder="Code / SKU"
                    {...register("sku")}
                    className={errors.sku ? "border-red-500" : ""}
                  />
                  {errors.sku && (
                    <p className="text-red-500 text-xs">{errors.sku.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">سعر الشراء</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("purchasePrice")}
                    className={errors.purchasePrice ? "border-red-500" : ""}
                  />
                  {errors.purchasePrice && (
                    <p className="text-red-500 text-xs">
                      {errors.purchasePrice.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">سعر البيع</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("sellingPrice")}
                    className={errors.sellingPrice ? "border-red-500" : ""}
                  />
                  {errors.sellingPrice && (
                    <p className="text-red-500 text-xs">
                      {errors.sellingPrice.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Input
                  id="description"
                  className="h-20"
                  placeholder="وصف المنتج..."
                  {...register("description")}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "جاري الحفظ..." : "حفظ المنتج"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full md:w-auto"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
