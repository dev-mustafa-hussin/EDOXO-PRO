"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Menu } from "lucide-react";

export function AnnualChart({ sales }: { sales: any[] }) {
  const currentYear = new Date().getFullYear();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Calculate totals per month
  const data = months.map((month, index) => {
    // Note: Month is 0-indexed in JS Date, but we match by string for simplicity or proper date parsing
    // Better to use date parsing to ensure correct year
    const monthTotal = sales
      .filter((s) => {
        const d = new Date(s.date);
        return d.getMonth() === index && d.getFullYear() === currentYear;
      })
      .reduce((sum, s) => sum + s.grandTotal, 0);
    return { month, total: monthTotal };
  });

  const maxTotal = Math.max(...data.map((d) => d.total), 1);

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
          <CardTitle className="text-base">
            السنة المالية الحالية ({currentYear})
          </CardTitle>
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48 relative">
          <div className="absolute left-0 top-0 text-xs text-gray-400">
            أعلى المبيعات {maxTotal.toLocaleString()} EGP
          </div>
          <div className="absolute left-0 bottom-1/2 text-xs text-gray-400">
            0
          </div>
          <div className="flex items-end justify-between h-full pt-6 pb-4 px-4">
            {data.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-1 group relative w-full mx-1"
              >
                <div
                  className="w-full max-w-[20px] bg-blue-500 rounded-t-sm transition-all hover:bg-blue-700"
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
          <div className="absolute bottom-1/2 left-0 right-0 border-t border-dashed border-gray-200"></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2 px-2">
          {months.map((month, i) => (
            <span key={i} className="text-[10px] w-full text-center">
              {month}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
