"use client";

import { PanelRightClose } from "lucide-react";
import { NotificationsMenu } from "./notifications-menu";
import { UserMenu } from "./user-menu";
import { GlobalTools } from "./global-tools";

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenCalculator?: () => void;
  onOpenProfit?: () => void;
}

export function Header({
  onToggleSidebar,
  onOpenCalculator = () => {},
  onOpenProfit = () => {},
}: HeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground h-14 flex items-center justify-between px-4 sticky top-0 z-50 shadow-md border-b">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-white/10 rounded-md transition-colors"
          title="طي/توسيع القائمة"
        >
          <PanelRightClose className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          <span className="text-lg font-bold tracking-tight">EDOXO PRO</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Global Tools (Calculator, Profit, Date) */}
        <GlobalTools
          onOpenCalculator={onOpenCalculator}
          onOpenProfit={onOpenProfit}
        />

        {/* Separator - Visible on larger screens */}
        <div className="hidden md:block w-px h-6 bg-white/20"></div>

        {/* Notifications */}
        <NotificationsMenu />

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
}
