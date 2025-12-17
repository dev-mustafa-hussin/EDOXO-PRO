"use client";

import { useState } from "react";
import { ShieldAlert, Lock, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PermissionRequestService } from "@/services/permission-request-service";

export default function AccessDeniedPage() {
  const router = useRouter();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestAccess = async () => {
    try {
      setIsRequesting(true);
      await PermissionRequestService.requestAccess({
        url: window.location.href,
        reason: "User requested access via Access Denied page",
      });
      toast.success("تم إرسال طلب الصلاحية إلى المدير بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء إرسال الطلب");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      dir="rtl"
    >
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse"></div>
          <div className="relative bg-white rounded-full p-6 shadow-sm border-2 border-red-100 flex items-center justify-center">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            عفواً، ليس لديك صلاحية
          </h1>
          <p className="text-gray-500">
            للاسف لا تملك الصلاحيات اللازمة للوصول إلى هذه الصفحة.
            <br />
            اذا كنت تعتقد أن هذا خطأ، يمكنك طلب الصلاحية من المدير.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            عودة للسابق
          </Button>

          <Button
            onClick={handleRequestAccess}
            disabled={isRequesting}
            className="bg-red-600 hover:bg-red-700 gap-2 text-white"
          >
            {isRequesting ? (
              "جاري الإرسال..."
            ) : (
              <>
                <Send className="w-4 h-4" />
                طلب صلاحية وصول
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
