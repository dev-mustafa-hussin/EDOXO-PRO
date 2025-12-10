"use client";

import Link from "next/link";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { MenuItem } from "./menu-config";

interface SidebarItemProps {
  item: MenuItem;
  collapsed: boolean;
  isOpen?: boolean;
  onToggle: () => void;
  isActive: boolean;
  isParentActive: boolean;
  pathname: string;
}

export function SidebarItem({
  item,
  collapsed,
  isOpen,
  onToggle,
  isActive,
  isParentActive,
  pathname,
}: SidebarItemProps) {
  if (item.hasDropdown) {
    return (
      <div>
        <button
          onClick={onToggle}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
            isParentActive
              ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          title={collapsed ? item.label : undefined}
        >
          <item.icon className="w-5 h-5 flex-shrink-0" />
          {!collapsed && (
            <>
              <span className="flex items-center gap-1 flex-1 text-right">
                {item.hasEmoji && <span>🛍️</span>}
                {item.label}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </>
          )}
        </button>
        {item.subItems && isOpen && !collapsed && (
          <div className="bg-gray-50 border-r-2 border-gray-200">
            {item.subItems.map((subItem, subIndex) => (
              <Link
                key={subIndex}
                href={subItem.href}
                className={`block px-10 py-2 text-sm transition-colors ${
                  pathname === subItem.href
                    ? "bg-blue-100 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                }`}
              >
                {subItem.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || "#"}
      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
        isActive
          ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
          : "text-gray-600 hover:bg-gray-50"
      }`}
      title={collapsed ? item.label : undefined}
    >
      <item.icon className="w-5 h-5 flex-shrink-0" />
      {!collapsed && (
        <>
          <span className="flex items-center gap-1 flex-1">
            {item.hasEmoji && <span>🛍️</span>}
            {item.label}
          </span>
          <ChevronLeft className="w-4 h-4" />
        </>
      )}
    </Link>
  );
}
