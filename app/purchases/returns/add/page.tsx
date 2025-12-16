"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Undo2, Plus, Trash2, Calendar, Save, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContactStore } from "@/store/contact-store";
import { useProductStore } from "@/store/product-store";
import { useToast } from "@/components/ui/use-toast";
import { PurchaseReturnService } from "@/services/purchase-return-service";

// Schema Validation
const purchaseReturnItemSchema = z.object({
  productId: z.string().min(1, "المنتج مطلوب"),
  quantity: z.number().min(1, "الكمية يجب أن تكون 1 على الأقل"),
  unitCost: z.number().min(0, "التكلفة يجب أن تكون 0 أو أكثر"),
  tax: z.number().optional().default(0),
});

const purchaseReturnSchema = z.object({
  supplierId: z.string().min(1, "المورد مطلوب"),
  date: z.string().min(1, "التاريخ مطلوب"),
  status: z.enum(["completed", "pending"]),
  paymentStatus: z.enum(["paid", "partial", "unpaid"]),
  items: z
    .array(purchaseReturnItemSchema)
    .min(1, "يجب إضافة منتج واحد على الأقل"),
  shippingCost: z.number().optional().default(0),
  discountTotal: z.number().optional().default(0),
  paidAmount: z.number().min(0, "المبلغ المسترد يجب أن يكون 0 أو أكثر"),
  notes: z.string().optional(),
});

type PurchaseReturnFormValues = z.infer<typeof purchaseReturnSchema>;

export default function AddPurchaseReturnPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const { contacts, fetchContacts, getContactsByType } = useContactStore();
  const { products, fetchProducts } = useProductStore();

  const suppliers = getContactsByType("supplier");

  const form = useForm<PurchaseReturnFormValues>({
    resolver: zodResolver(purchaseReturnSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      status: "completed",
      paymentStatus: "paid", // Default to paid (refunded)
      items: [{ productId: "", quantity: 1, unitCost: 0, tax: 0 }],
      shippingCost: 0,
      discountTotal: 0,
      paidAmount: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Watch values for calculations
  const watchedItems = form.watch("items");
  const shippingCost = form.watch("shippingCost") || 0;
  const discountTotal = form.watch("discountTotal") || 0;

  // Calculate Totals
  const subtotal = watchedItems.reduce((acc, item) => {
    return acc + item.quantity * item.unitCost;
  }, 0);

  const taxTotal = watchedItems.reduce((acc, item) => {
    return acc + (item.tax || 0);
  }, 0);

  const grandTotal = subtotal + taxTotal + shippingCost - discountTotal;

  useEffect(() => {
    fetchContacts();
    fetchProducts();
  }, [fetchContacts, fetchProducts]);

  const onSubmit = async (data: PurchaseReturnFormValues) => {
    try {
      await PurchaseReturnService.create(data);

      toast({
        title: "تم إضافة المرتجع بنجاح",
        description: "تم حفظ مرتجع المشتريات في النظام",
        className: "bg-green-500 text-white",
      });

      router.push("/purchases/returns");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "خطأ في الإضافة",
        description:
          error.response?.data?.message || "حدث خطأ أثناء حفظ المرتجع",
        variant: "destructive",
      });
    }
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      form.setValue(`items.${index}.productId`, productId);
      form.setValue(`items.${index}.unitCost`, product.purchasePrice);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              رجوع
            </Button>
            <span>/</span>
            <span>المشتريات</span>
            <span>/</span>
            <span className="text-blue-600">أضف مرتجع</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Undo2 className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              أضف مرتجع مشتريات
            </h1>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Main Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Supplier Select */}
                <div className="space-y-2">
                  <Label>
                    المورد <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(val) => form.setValue("supplierId", val)}
                    defaultValue={form.getValues("supplierId")}
                  >
                    <SelectTrigger
                      className={
                        form.formState.errors.supplierId ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="اختر المورد" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.supplierId && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.supplierId.message}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label>
                    تاريخ المرتجع <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input type="date" {...form.register("date")} />
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label>حالة المرتجع</Label>
                  <Select
                    onValueChange={(val: any) => form.setValue("status", val)}
                    defaultValue={form.getValues("status")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">مكتمل</SelectItem>
                      <SelectItem value="pending">قيد المعالجة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Items Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">المنتجات المرتجعة</h3>

              <div className="border rounded-lg overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="p-3 text-right w-[40%]">المنتج</th>
                      <th className="p-3 text-right w-[15%]">الكمية</th>
                      <th className="p-3 text-right w-[15%]">التكلفة</th>
                      <th className="p-3 text-right w-[15%]">الإجمالي</th>
                      <th className="p-3 text-center w-[10%]">خيارات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => (
                      <tr key={field.id} className="border-t">
                        <td className="p-2">
                          <Select
                            onValueChange={(val) =>
                              handleProductChange(index, val)
                            }
                            value={form.watch(`items.${index}.productId`)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="اختر منتج" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {form.formState.errors.items?.[index]?.productId && (
                            <p className="text-red-500 text-xs mt-1">مطلوب</p>
                          )}
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            {...form.register(`items.${index}.quantity`, {
                              valueAsNumber: true,
                            })}
                            className="text-center"
                            min={1}
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            {...form.register(`items.${index}.unitCost`, {
                              valueAsNumber: true,
                            })}
                            className="text-center"
                            min={0}
                          />
                        </td>
                        <td className="p-2 font-medium text-center">
                          {(
                            form.watch(`items.${index}.quantity`) *
                            form.watch(`items.${index}.unitCost`)
                          ).toFixed(2)}
                        </td>
                        <td className="p-2 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({ productId: "", quantity: 1, unitCost: 0, tax: 0 })
                }
                className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Plus className="w-4 h-4" />
                إضافة منتج آخر
              </Button>
            </div>

            {/* Totals & Payment Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Notes & Extra Costs */}
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>الخصم</Label>
                    <Input
                      type="number"
                      {...form.register("discountTotal", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>تكلفة الشحن</Label>
                    <Input
                      type="number"
                      {...form.register("shippingCost", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>ملاحظات</Label>
                  <Input
                    as="textarea"
                    className="h-24 resize-none"
                    {...form.register("notes")}
                    placeholder="أي ملاحظات إضافية..."
                  />
                </div>
              </div>

              {/* Final Calculations */}
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-gray-600">المجموع الفرعي:</span>
                  <span className="font-medium">{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-gray-600">ضريبة (Total Tax):</span>
                  <span className="font-medium">{taxTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-gray-600">الشحن:</span>
                  <span className="font-medium">{shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b pb-2 text-red-600">
                  <span>الخصم:</span>
                  <span>-{discountTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold pt-2 border-t text-blue-700">
                  <span>الإجمالي الكلي:</span>
                  <span>{grandTotal.toFixed(2)}</span>
                </div>

                <div className="bg-gray-50 p-4 rounded-md space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>حالة الاسترداد (الدفع)</Label>
                    <Select
                      onValueChange={(val: any) =>
                        form.setValue("paymentStatus", val)
                      }
                      defaultValue={form.getValues("paymentStatus")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر حالة الدفع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">
                          تم الاسترداد (Paid)
                        </SelectItem>
                        <SelectItem value="partial">استرداد جزئي</SelectItem>
                        <SelectItem value="unpaid">غير مسترد</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>المبلغ المسترد (المدفوع)</Label>
                    <Input
                      type="number"
                      {...form.register("paidAmount", { valueAsNumber: true })}
                      className="bg-white"
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium pt-2">
                    <span>المبلغ المتبقي:</span>
                    <span
                      className={
                        grandTotal - form.watch("paidAmount") > 0
                          ? "text-red-600"
                          : "text-green-600"
                      }
                    >
                      {(grandTotal - form.watch("paidAmount")).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 min-w-[120px] gap-2"
              >
                <Save className="w-4 h-4" />
                حفظ المرتجع
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
