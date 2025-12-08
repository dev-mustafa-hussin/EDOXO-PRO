import { Sale } from "@/types/sales";
import { format } from "date-fns";

interface InvoicePrintProps {
  sale: Sale;
}

export function InvoicePrint({ sale }: InvoicePrintProps) {
  return (
    <div
      className="bg-white p-8 max-w-[800px] mx-auto print:p-0 print:max-w-none"
      dir="rtl"
    >
      {/* Header */}
      <div className="text-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold mb-2">EDOXO PRO</h1>
        <p className="text-gray-600">نظام إدارة المبيعات والمخزون</p>
        <p className="text-gray-500 text-sm mt-1">
          الرقم الضريبي: 300012345678903
        </p>
      </div>

      {/* Invoice Details */}
      <div className="flex justify-between mb-6 text-sm">
        <div>
          <p>
            <strong>رقم الفاتورة:</strong> {sale.invoiceNumber}
          </p>
          <p>
            <strong>التاريخ:</strong>{" "}
            {format(new Date(sale.date), "yyyy-MM-dd")}
          </p>
        </div>
        <div className="text-left">
          <p>
            <strong>العميل:</strong> {sale.customerName}
          </p>
          <p>
            <strong>بواسطة:</strong> {sale.createdBy}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-6 text-sm border-collapse">
        <thead>
          <tr className="border-b border-black">
            <th className="py-2 text-right">المنتج</th>
            <th className="py-2 text-center">الكمية</th>
            <th className="py-2 text-center">السعر</th>
            <th className="py-2 text-left">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((item) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="py-2">{item.productName}</td>
              <td className="py-2 text-center">{item.quantity}</td>
              <td className="py-2 text-center">
                {item.unitPrice.toLocaleString()}
              </td>
              <td className="py-2 text-left">{item.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex flex-col items-end text-sm space-y-1 mb-8">
        <div className="flex justify-between w-48">
          <span>المجموع:</span>
          <span>{sale.subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between w-48">
          <span>الضريبة (15%):</span>
          <span>{sale.taxTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between w-48">
          <span>الخصم:</span>
          <span>{sale.discountTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between w-48 font-bold text-lg border-t pt-1 mt-1">
          <span>الإجمالي:</span>
          <span>{sale.grandTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 border-t pt-4">
        <p>شكراً لتعاملكم معنا!</p>
        <p className="mt-1">
          سياسة الاسترجاع: خلال 7 أيام مع إحضار الفاتورة الأصلية.
        </p>
      </div>
    </div>
  );
}
