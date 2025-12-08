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
import {
  ShoppingCart,
  Plus,
  Trash2,
  Calendar,
  Save,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePurchaseStore } from "@/store/purchase-store";
import { useContactStore } from "@/store/contact-store";
import { useProductStore } from "@/store/product-store";
import { useToast } from "@/components/ui/use-toast";

// Schema Validation
const purchaseItemSchema = z.object({
  productId: z.string().min(1, "المنتج مطلوب"),
  quantity: z.number().min(1, "الكمية يجب أن تكون 1 على الأقل"),
  unitCost: z.number().min(0, "التكلفة يجب أن تكون 0 أو أكثر"),
  tax: z.number().optional().default(0),
});

const purchaseSchema = z.object({
  supplierId: z.string().min(1, "المورد مطلوب"),
  date: z.string().min(1, "التاريخ مطلوب"),
  status: z.enum(["received", "pending", "ordered", "canceled"]),
  paymentStatus: z.enum(["paid", "partial", "unpaid"]),
  items: z.array(purchaseItemSchema).min(1, "يجب إضافة منتج واحد على الأقل"),
  shippingCost: z.number().optional().default(0),
  discountTotal: z.number().optional().default(0),
  paidAmount: z.number().min(0, "المبلغ المدفوع يجب أن يكون 0 أو أكثر"),
  notes: z.string().optional(),
});

type PurchaseFormValues = z.infer<typeof purchaseSchema>;

export default function AddPurchasePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  // const { toast } = useToast();

  const { addPurchase } = usePurchaseStore();
  const { contacts, fetchContacts, getContactsByType } = useContactStore();
  const { products, fetchProducts } = useProductStore();

  const suppliers = getContactsByType("supplier");

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      status: "received",
      paymentStatus: "paid",
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
    // Simple tax calculation per item if needed, assuming tax is amount not percent for now or simplified
    return acc + (item.tax || 0);
  }, 0);

  const grandTotal = subtotal + taxTotal + shippingCost - discountTotal;

  useEffect(() => {
    fetchContacts();
    fetchProducts();
  }, [fetchContacts, fetchProducts]);

  const onSubmit = async (data: PurchaseFormValues) => {
    try {
      const supplier = suppliers.find((s) => s.id === data.supplierId);

      const purchaseData = {
        id: crypto.randomUUID(),
        referenceNumber: `PO-${Date.now()}`,
        supplierId: data.supplierId,
        supplierName: supplier?.name || "Unknown Supplier",
        ...data,
        items: data.items.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return {
            id: crypto.randomUUID(),
            productId: item.productId,
            productName: product?.name || "Unknown Product",
            quantity: item.quantity,
            unitCost: item.unitCost,
            subtotal: item.quantity * item.unitCost,
            tax: item.tax,
            total: item.quantity * item.unitCost + (item.tax || 0),
          };
        }),
        subtotal,
        taxTotal,
        grandTotal,
        dueAmount: grandTotal - data.paidAmount,
        warehouseId: "WH-DEFAULT",
        createdBy: "Admin",
        createdAt: new Date().toISOString(),
      };

      await addPurchase(purchaseData);

      // toast({
      //   title: "تم إضافة المشتريات بنجاح",
      //   description: `تم إنشاء الفاتورة رقم ${purchaseData.referenceNumber}`,
      // });

      router.push("/purchases/list");
    } catch (error) {
      console.error("Error submitting form:", error);
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
      <Header
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenCalculator={() => {}}
        onOpenProfit={() => {}}
      />
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
            <span className="text-blue-600">أضف مشتريات</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              أضف مشتريات جديدة
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
                    تاريخ الشراء <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input type="date" {...form.register("date")} />
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label>حالة الشراء</Label>
                  <Select
                    onValueChange={(val: any) => form.setValue("status", val)}
                    defaultValue={form.getValues("status")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="received">تم الاستلام</SelectItem>
                      <SelectItem value="pending">قيد الانتظار</SelectItem>
                      <SelectItem value="ordered">تم الطلب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Items Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">المنتجات</h3>

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
                    <Label>حالة الدفع</Label>
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
                        <SelectItem value="paid">مدفوع بالكامل</SelectItem>
                        <SelectItem value="partial">مدفوع جزئياً</SelectItem>
                        <SelectItem value="unpaid">غير مدفوع</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>المبلغ المدفوع</Label>
                    <Input
                      type="number"
                      {...form.register("paidAmount", { valueAsNumber: true })}
                      className="bg-white"
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium pt-2">
                    <span>المبلغ المستحق:</span>
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
                حفظ الفاتورة
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
