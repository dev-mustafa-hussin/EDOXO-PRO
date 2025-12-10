"use client";

import { useState, useEffect } from "react";
import { Calendar, Calculator, DollarSign } from "lucide-react";

interface GlobalToolsProps {
  onOpenCalculator: () => void;
  onOpenProfit: () => void;
}

export function GlobalTools({
  onOpenCalculator,
  onOpenProfit,
}: GlobalToolsProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onOpenCalculator}
        className="p-2 hover:bg-blue-600 rounded transition-colors"
        title="آلة حاسبة"
      >
        <Calculator className="w-4 h-4" />
      </button>

      <button
        onClick={onOpenProfit}
        className="hidden md:flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 px-3 py-1 rounded transition-colors shadow-sm"
        title="ربح اليوم"
      >
        <DollarSign className="w-4 h-4" />
        <span>الربح اليومي</span>
      </button>

      <div className="hidden lg:flex items-center gap-2 text-sm bg-blue-700 px-3 py-1 rounded border border-blue-600">
        <Calendar className="w-4 h-4" />
        <ClientDate />
      </div>
    </div>
  );
}

function ClientDate() {
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(new Date().toLocaleDateString("en-GB"));
  }, []);

  if (!date)
    return <span className="w-20 h-4 bg-blue-600/50 animate-pulse rounded" />;

  return <span>{date}</span>;
}
