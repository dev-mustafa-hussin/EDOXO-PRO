import type React from "react";
import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "sonner";

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EDOXO PRO - ERP Dashboard",
  description: "Cloud ERP, Accounting, Sales, Inventory Software",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${notoSansArabic.className} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
