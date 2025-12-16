"use client";

import { useEffect, useState } from "react";
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
import { Warehouse, WarehouseService } from "@/services/warehouse-service";
import { StockTransferService } from "@/services/stock-transfer-service";
import { useProductStore } from "@/store/product-store";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  Plus,
  Trash2,
  Warehouse as WarehouseIcon,
  Search,
} from "lucide-react";

// Schema
const stockTransferItemSchema = z.object({
  productId: z.coerce.number().min(1, "المنتج مطلوب"),
  productName: z.string().optional(),
  quantity: z.coerce.number().min(1, "الكمية مطلوبة"),
});

const stockTransferSchema = z
  .object({
    fromWarehouseId: z.coerce.number().min(1, "المصدر مطلوب"),
    toWarehouseId: z.coerce.number().min(1, "الوجهة مطلوبة"),
    date: z.string().min(1, "التاريخ مطلوب"),
    status: z.enum(["pending", "sent", "completed"]),
    shippingCost: z.coerce.number().optional(),
    notes: z.string().optional(),
    items: z
      .array(stockTransferItemSchema)
      .min(1, "يجب إضافة منتج واحد على الأقل"),
  })
  .refine((data) => data.fromWarehouseId !== data.toWarehouseId, {
    message: "لا يمكن التحويل لنفس المستودع",
    path: ["toWarehouseId"],
  });

type StockTransferFormValues = z.infer<typeof stockTransferSchema>;

export default function AddStockTransferPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  const { toast } = useToast();
  const router = useRouter();

  // Stores
  const {
    products,
    fetchProducts,
    isLoading: productsLoading,
  } = useProductStore();

  const form = useForm<StockTransferFormValues>({
    resolver: zodResolver(stockTransferSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      shippingCost: 0,
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Initial Data Fetch
  useEffect(() => {
    const loadData = async () => {
      try {
        const wData = await WarehouseService.getAll();
        setWarehouses(wData);
        await fetchProducts();
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };
    loadData();
  }, [fetchProducts]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const addItem = (product: any) => {
    append({
      productId: Number(product.id),
      productName: product.name,
      quantity: 1,
    });
    setProductSearch("");
  };

  const onSubmit = async (data: StockTransferFormValues) => {
    setIsLoading(true);
    try {
      await StockTransferService.create(data);
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم إنشاء تحويل المخزون",
        variant: "default",
        className: "bg-green-600 text-white",
      });
      router.push("/stock-transfers");
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.response?.data?.message || "حدث خطأ أثناء الحفظ",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
            <span>تحويلات المخزون</span>
            <span>/</span>
            <span className="text-blue-600">إضافة تحويل</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <WarehouseIcon className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              إضافة تحويل مخزون جديد
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Header Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>من مستودع</Label>
                  <Controller
                    control={form.control}
                    name="fromWarehouseId"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المصدر" />
                        </SelectTrigger>
                        <SelectContent>
                          {warehouses.map((w) => (
                            <SelectItem key={w.id} value={w.id.toString()}>
                              {w.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.fromWarehouseId && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.fromWarehouseId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>إلى مستودع</Label>
                  <Controller
                    control={form.control}
                    name="toWarehouseId"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الوجهة" />
                        </SelectTrigger>
                        <SelectContent>
                          {warehouses.map((w) => (
                            <SelectItem key={w.id} value={w.id.toString()}>
                              {w.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.toWarehouseId && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.toWarehouseId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>تاريخ التحويل</Label>
                  <Input type="date" {...form.register("date")} />
                  {form.formState.errors.date && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.date.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2 max-w-xs">
                <Label>حالة التحويل</Label>
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">مكتمل</SelectItem>
                        <SelectItem value="pending">قيد الانتظار</SelectItem>
                        <SelectItem value="sent">تم الإرسال</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Product Selection */}
              <div className="border p-4 rounded-md bg-gray-50 space-y-4">
                <h3 className="font-semibold text-gray-700">المنتجات</h3>

                {/* Search Bar */}
                <div className="relative max-w-md">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="ابحث لإضافة منتج..."
                    className="pr-10"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                  {productSearch && (
                    <div className="absolute top-full right-0 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto z-10 mt-1">
                      {filteredProducts.length === 0 ? (
                        <div className="p-2 text-gray-500 text-sm">
                          لا توجد نتائج
                        </div>
                      ) : (
                        filteredProducts.map((product) => (
                          <div
                            key={product.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between text-sm"
                            onClick={() => addItem(product)}
                          >
                            <span>{product.name}</span>
                            <span className="text-gray-500">
                              مخزون: {product.stock}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Items Table */}
                <div className="border rounded-md bg-white overflow-hidden">
                  <table className="w-full text-sm text-right">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="h-12 px-4 text-right align-middle font-medium text-gray-500">
                          المنتج
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-gray-500 w-32">
                          الكمية
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-gray-500 w-16"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {fields.length === 0 ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="p-4 text-center py-8 text-gray-500"
                          >
                            قم بإضافة منتجات
                          </td>
                        </tr>
                      ) : (
                        fields.map((field, index) => (
                          <tr
                            key={field.id}
                            className="border-b transition-colors hover:bg-gray-50"
                          >
                            <td className="p-4 align-middle">
                              {field.productName}
                            </td>
                            <td className="p-4 align-middle">
                              <Input
                                type="number"
                                min="1"
                                {...form.register(
                                  `items.${index}.quantity` as const
                                )}
                              />
                            </td>
                            <td className="p-4 align-middle">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-red-500"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {form.formState.errors.items && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.items.message}
                  </p>
                )}
              </div>

              {/* Footer Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>تكلفة الشحن</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    {...form.register("shippingCost")}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ملاحظات</Label>
                  <Input
                    as="textarea"
                    className="h-20"
                    placeholder="ملاحظات..."
                    {...form.register("notes")}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto px-8"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  حفظ التحويل
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
