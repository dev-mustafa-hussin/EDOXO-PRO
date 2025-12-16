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
import { Users, Save } from "lucide-react";
import { CustomerService } from "@/services/customer-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define Validation Schema
const customerSchema = z.object({
  name: z.string().min(3, "اسم العميل يجب أن يكون 3 أحرف على الأقل"),
  phone: z.string().min(10, "رقم الهاتف غير صالح"),
  email: z
    .string()
    .email("البريد الإلكتروني غير صالح")
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
  taxNumber: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export default function AddCustomerPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      taxNumber: "",
    },
  });

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      await CustomerService.create({
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        taxNumber: data.taxNumber,
      });
      toast.success("تم إضافة العميل بنجاح");
      router.push("/contacts/customers");
    } catch (error) {
      console.error("Failed to create customer:", error);
      toast.error("فشل إضافة العميل");
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
            <span>العملاء</span>
            <span>/</span>
            <span className="text-blue-600">أضف عميل</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              أضف عميل جديد
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
                    اسم العميل <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="الاسم الكامل"
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
                  <Label htmlFor="phone">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    placeholder="05xxxxxxxx"
                    {...register("phone")}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@mail.com"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxNumber">الرقم الضريبي</Label>
                  <Input
                    id="taxNumber"
                    placeholder="الرقم الضريبي"
                    {...register("taxNumber")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <Input
                  id="address"
                  placeholder="العنوان الكامل..."
                  {...register("address")}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "جاري الحفظ..." : "حفظ العميل"}
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
