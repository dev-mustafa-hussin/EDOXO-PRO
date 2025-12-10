"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { menuItems } from "./sidebar/menu-config";
import { SidebarItem } from "./sidebar/sidebar-item";

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    "إدارة المستخدمين": pathname?.startsWith("/user-management") || false,
  });

  const filteredItems = menuItems.filter(
    (item) =>
      !item.allowedRoles || (user && item.allowedRoles.includes(user.role))
  );

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href;
  };

  const isParentActive = (subItems?: any[]) => {
    if (!subItems) return false;
    return subItems.some((item) => pathname === item.href);
  };

  return (
    <aside
      className={`bg-white min-h-screen border-l border-gray-200 shadow-sm transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <nav className="py-4">
        {filteredItems.map((item, index) => (
          <SidebarItem
            key={index}
            item={item}
            collapsed={collapsed}
            isOpen={openDropdowns[item.label]}
            onToggle={() => toggleDropdown(item.label)}
            isActive={isActive(item.href) || pathname === item.href}
            isParentActive={isParentActive(item.subItems)}
            pathname={pathname}
          />
        ))}
      </nav>
    </aside>
  );
}
