"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { WelcomeSection } from "@/components/welcome-section";
import { QuickAccess } from "@/components/quick-access";
import { AlertBanner } from "@/components/alert-banner";
import { FinancialSummary } from "@/components/financial-summary";
import { SalesChart } from "@/components/sales-chart";
import { AnnualChart } from "@/components/annual-chart";
import { PaymentTables } from "@/components/payment-tables";
import { InventoryAlert } from "@/components/inventory-alert";
import { SalesOrders } from "@/components/sales-orders";
import { PendingShipments } from "@/components/pending-shipments";
import { CalculatorModal } from "@/components/calculator-modal";
import { ProfitModal } from "@/components/profit-modal";
import { useSaleStore } from "@/store/sale-store";
import { usePurchaseStore } from "@/store/purchase-store";

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [profitOpen, setProfitOpen] = useState(false);

  const { sales, fetchSales } = useSaleStore();
  const { purchases, fetchPurchases } = usePurchaseStore();

  useEffect(() => {
    fetchSales();
    fetchPurchases();
  }, [fetchSales, fetchPurchases]);

  const totalSales = sales.reduce((acc, sale) => acc + sale.grandTotal, 0);
  const totalPurchases = purchases.reduce(
    (acc, purchase) => acc + purchase.grandTotal,
    0
  );
  const unpaidSales = sales.reduce((acc, sale) => acc + sale.dueAmount, 0);
  const unpaidPurchases = purchases.reduce(
    (acc, purchase) => acc + purchase.dueAmount,
    0
  );
  const netProfit = totalSales - totalPurchases;

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      <Header
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenCalculator={() => setCalculatorOpen(true)}
        onOpenProfit={() => setProfitOpen(true)}
      />
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 p-6 overflow-auto">
          <WelcomeSection />
          <AlertBanner />
          <QuickAccess />
          <FinancialSummary
            totalSales={totalSales}
            totalPurchases={totalPurchases}
            unpaidSales={unpaidSales}
            unpaidPurchases={unpaidPurchases}
            netProfit={netProfit}
          />
          <SalesChart />
          <AnnualChart />
          <PaymentTables />
          <InventoryAlert />
          <SalesOrders />
          <PendingShipments />
          <footer className="text-center text-sm text-gray-500 py-4 mt-4">
            Zoftar | Cloud ERP, Accounting, Sales, Inventory Software - V9.3 |
            Copyright © 2025 All rights reserved
          </footer>
        </main>
      </div>
      <CalculatorModal
        open={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
      />
      <ProfitModal open={profitOpen} onClose={() => setProfitOpen(false)} />
    </div>
  );
}
