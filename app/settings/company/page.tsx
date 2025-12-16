"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SettingService } from "@/services/setting-service";
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
import { Building2, Save, Loader2 } from "lucide-react";

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
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      taxNumber: "",
      logoUrl: "",
      termsAndConditions: "",
    },
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await SettingService.getSettings();
        if (data) {
          form.reset({
            name: data.company_name || "",
            address: data.company_address || "",
            phone: data.company_phone || "",
            email: data.company_email || "",
            taxNumber: data.company_tax_number || "",
            logoUrl: data.company_logo || "",
            termsAndConditions: data.invoice_terms || "",
          });
        }
      } catch (error) {
        console.error("Failed to load settings", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, [form]);

  const onSubmit = async (data: CompanyFormValues) => {
    setIsSaving(true);
    try {
      // Map form values to backend keys
      const settingsPayload = {
        company_name: data.name,
        company_address: data.address,
        company_phone: data.phone,
        company_email: data.email,
        company_tax_number: data.taxNumber,
        company_logo: data.logoUrl,
        invoice_terms: data.termsAndConditions,
      };

      await SettingService.updateSettings(settingsPayload);

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث بيانات الشركة.",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل حفظ البيانات.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

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
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full md:w-auto"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 ml-2" />
                        حفظ التغييرات
                      </>
                    )}
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
