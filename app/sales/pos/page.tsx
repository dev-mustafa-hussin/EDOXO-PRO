"use client";

import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function POSPage() {
  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4"
      dir="rtl"
    >
      <Store className="w-16 h-16 text-blue-600 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        نقطة البيع (POS)
      </h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        هذه الصفحة ستكون واجهة نقطة البيع الكاملة للكاشير. يتم بناؤها لتكون
        سريعة وسهلة الاستخدام.
      </p>
      <Link href="/sales/all">
        <Button variant="outline">العودة للمبيعات</Button>
      </Link>
    </div>
  );
}
