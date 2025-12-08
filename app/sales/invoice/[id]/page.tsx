"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSaleStore } from "@/store/sale-store";
import { Sale } from "@/types/sales";
import { InvoicePrint } from "@/components/printing/invoice-print";
import { Button } from "@/components/ui/button";
import { Printer, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function InvoicePage() {
  const params = useParams();
  const { getSaleById } = useSaleStore();
  const [sale, setSale] = useState<Sale | undefined>(undefined);

  useEffect(() => {
    if (params.id) {
      const foundSale = getSaleById(params.id as string);
      setSale(foundSale);
    }
  }, [params.id, getSaleById]);

  if (!sale) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>جاري تحميل الفاتورة أو لم يتم العثور عليها...</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white">
      {/* Toolbar (Hidden when printing) */}
      <div
        className="max-w-[800px] mx-auto mb-6 flex justify-between items-center print:hidden"
        dir="rtl"
      >
        <Link href="/sales/pos">
          <Button variant="outline" className="gap-2">
            <ArrowRight className="w-4 h-4" />
            عودة لنقطة البيع
          </Button>
        </Link>
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" />
          طباعة
        </Button>
      </div>

      {/* Invoice Component */}
      <div className="shadow-lg print:shadow-none">
        <InvoicePrint sale={sale} />
      </div>
    </div>
  );
}
