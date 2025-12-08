"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Menu } from "lucide-react";

export function SalesChart({ sales }: { sales: any[] }) {
  // Generate last 30 days
  const today = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (29 - i));
    return d;
  });

  // Calculate totals per day
  const data = days.map((day) => {
    const dateStr = day.toISOString().split("T")[0];
    const dayTotal = sales
      .filter((s) => s.date.startsWith(dateStr))
      .reduce((sum, s) => sum + s.grandTotal, 0);
    return { date: day, total: dayTotal };
  });

  const maxTotal = Math.max(...data.map((d) => d.total), 1); // Avoid 0 division

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="w-4 h-4 text-gray-400" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-600">EDOXO PRO (BL0001)</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">المبيعات فى آخر 30 يوماً</CardTitle>
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48 relative">
          <div className="absolute left-0 top-0 text-xs text-gray-400">
            أعلى المبيعات {maxTotal.toLocaleString()} EGP
          </div>
          <div className="absolute left-0 bottom-0 text-xs text-gray-400">
            0
          </div>
          <div className="flex items-end justify-between h-full pt-6 pb-4">
            {data.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-1 group relative"
              >
                <div
                  className="w-2 bg-blue-500 rounded-full transition-all hover:bg-blue-700"
                  style={{
                    height: `${(item.total / maxTotal) * 100}%`,
                    minHeight: "4px",
                  }}
                ></div>
                {/* Tooltip */}
                <span className="absolute bottom-full mb-1 hidden group-hover:block text-[10px] bg-black text-white px-1 rounded z-10 whitespace-nowrap">
                  {item.total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t border-dashed border-gray-200"></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2 overflow-x-auto">
          {data
            .filter((_, i) => i % 5 === 0)
            .map(
              (
                item,
                i // Show every 5th date to avoid clutter
              ) => (
                <span key={i} className="whitespace-nowrap text-[10px]">
                  {item.date.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              )
            )}
        </div>
      </CardContent>
    </Card>
  );
}
