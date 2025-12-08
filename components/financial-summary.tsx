import {
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Wallet,
  FileText,
  ShoppingBag,
  Banknote,
} from "lucide-react";

interface FinancialSummaryProps {
  totalSales: number;
  totalPurchases: number;
  unpaidSales: number;
  unpaidPurchases: number;
  netProfit: number; // For "Treasury" approximate
}

export function FinancialSummary({
  totalSales,
  totalPurchases,
  unpaidSales,
  unpaidPurchases,
  netProfit,
}: FinancialSummaryProps) {
  const summaryCards = [
    {
      icon: TrendingUp,
      label: "إجمالى المبيعات",
      value: `L.E ${totalSales.toLocaleString()}`,
      color: "bg-blue-600",
      iconBg: "bg-blue-500",
    },
    {
      icon: Banknote,
      label: "إجمالى الخزنة (الربح)",
      value: `L.E ${netProfit.toLocaleString()}`,
      color: "bg-blue-600",
      iconBg: "bg-blue-500",
    },
    {
      icon: Wallet,
      label: "الفواتير الغير مدفوعة",
      value: `L.E ${unpaidSales.toLocaleString()}`,
      color: "bg-blue-500",
      iconBg: "bg-blue-400",
    },
    {
      icon: RotateCcw,
      label: "إجمالى مرتجع المبيعات",
      value: "L.E 0.00",
      color: "bg-white border",
      textColor: "text-gray-700",
    },
    {
      icon: ShoppingBag,
      label: "إجمالى المشتريات",
      value: `L.E ${totalPurchases.toLocaleString()}`,
      color: "bg-teal-500",
      iconBg: "bg-teal-400",
    },
    {
      icon: FileText,
      label: "المشتريات الغير مدفوعة",
      value: `L.E ${unpaidPurchases.toLocaleString()}`,
      color: "bg-teal-500",
      iconBg: "bg-teal-400",
    },
    {
      icon: RotateCcw,
      label: "إجمالى مرتجع المشتريات",
      value: "L.E 0.00",
      color: "bg-white border",
      textColor: "text-gray-700",
    },
    {
      icon: TrendingDown,
      label: "مصروف",
      value: "L.E 0.00",
      color: "bg-white border",
      textColor: "text-gray-700",
      negative: true,
    },
  ];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} ${
              card.textColor || "text-white"
            } rounded-lg p-4 flex items-center justify-between`}
          >
            <div className="text-right">
              <p className="text-sm opacity-90">{card.label}</p>
              <p className="text-lg font-bold">{card.value}</p>
            </div>
            <div
              className={`w-10 h-10 ${
                card.iconBg || "bg-gray-200"
              } rounded-full flex items-center justify-center`}
            >
              <card.icon
                className={`w-5 h-5 ${
                  card.negative
                    ? "text-red-500"
                    : card.textColor
                    ? "text-gray-500"
                    : "text-white"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
