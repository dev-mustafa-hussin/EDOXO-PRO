"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCompanyStore } from "@/store/company-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Building2, Save } from "lucide-react";

const companySchema = z.object({
  name: z.string().min(2, "اسم الشركة مطلوب"),
  address: z.string().min(5, "العنوان مطلوب"),
  phone: z.string().min(8, "رقم الهاتف مطلوب"),
  email: z
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .optional()
    .or(z.literal("")),
  taxNumber: z.string().min(1, "الرقم الضريبي مطلوب"),
  logoUrl: z.string().url("رابط الشعار غير صحيح").optional().or(z.literal("")),
  termsAndConditions: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export default function CompanySettingsPage() {
  const { settings, updateSettings } = useCompanyStore();
  const { toast } = useToast();

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: settings,
  });

  // Load settings into form when store (persistence) hydrates
  useEffect(() => {
    form.reset(settings);
  }, [settings, form]);

  const onSubmit = (data: CompanyFormValues) => {
    updateSettings(data);
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم تحديث بيانات الشركة.",
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Building2 className="w-8 h-8 text-blue-600" />
          إعدادات الشركة
        </h1>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>بيانات المؤسسة</CardTitle>
            <CardDescription>
              هذه البيانات ستظهر في ترويسة (Header) وتذييل (Footer) الفواتير
              والتقارير.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم الشركة / المتجر</FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: متجر السعادة" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="taxNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الرقم الضريبي</FormLabel>
                        <FormControl>
                          <Input placeholder="الرقم الضريبي" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>العنوان</FormLabel>
                      <FormControl>
                        <Input placeholder="العنوان بالتفصيل" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl>
                          <Input placeholder="رقم الهاتف" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input placeholder="info@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رابط الشعار (URL)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="termsAndConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الشروط والأحكام (أسفل الفاتورة)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="سياسة الاسترجاع..."
                          className="h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-4">
                  <Button type="submit" size="lg" className="w-full md:w-auto">
                    <Save className="w-4 h-4 ml-2" />
                    حفظ التغييرات
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
