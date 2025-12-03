"use client";

import type React from "react";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Users,
  Phone,
  Box,
  ShoppingCart,
  BarChart3,
  Warehouse,
  Trash2,
  DollarSign,
  FileText,
  ClipboardList,
  Settings,
  UserCog,
  Store,
  ChevronLeft,
  ChevronDown,
  Bell,
} from "lucide-react";

interface SubItem {
  label: string;
  href: string;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  hasEmoji?: boolean;
  hasDropdown?: boolean;
  subItems?: SubItem[];
}

const menuItems: MenuItem[] = [
  { icon: Home, label: "الرئيسية", href: "/" },
  {
    icon: Users,
    label: "إدارة المستخدمين",
    hasDropdown: true,
    subItems: [
      { label: "المستخدمين", href: "/user-management/users" },
      { label: "الصلاحيات", href: "/user-management/roles" },
      { label: "المندوبين", href: "/user-management/delegates" },
    ],
  },
  {
    icon: Phone,
    label: "جهات الإتصال",
    hasDropdown: true,
    subItems: [
      { label: "الموردين", href: "/contacts/suppliers" },
      { label: "العملاء", href: "/contacts/customers" },
      { label: "مجموعات العملاء", href: "/contacts/customer-groups" },
      { label: "استيراد جهات الاتصال", href: "/contacts/import" },
      { label: "خريطة", href: "/contacts/map" },
    ],
  },
  {
    icon: Box,
    label: "المنتجات",
    hasDropdown: true,
    subItems: [
      { label: "قائمة المنتجات", href: "/products/list" },
      { label: "أضف منتجا", href: "/products/add" },
      { label: "Update Price", href: "/products/update-price" },
      { label: "طاقة الطاقات", href: "/products/labels" },
      { label: "التاليات", href: "/products/variants" },
      { label: "استيراد المنتجات", href: "/products/import" },
      { label: "استيراد المخزون المتقدمي", href: "/products/import-advanced" },
      { label: "مجموعة أسعار البيع", href: "/products/price-groups" },
      { label: "الوحدات", href: "/products/units" },
      { label: "الأقسام", href: "/products/categories" },
      { label: "العلامات التجارية", href: "/products/brands" },
      { label: "الحاقات", href: "/products/attachments" },
    ],
  },
  {
    icon: ShoppingCart,
    label: "المشتريات",
    hasDropdown: true,
    subItems: [
      { label: "قائمة المشتريات", href: "/purchases/list" },
      { label: "أضف مشتريات", href: "/purchases/add" },
      { label: "قائمة مرتجع المشتريات", href: "/purchases/returns" },
    ],
  },
  {
    icon: BarChart3,
    label: "المبيعات",
    hasDropdown: true,
    subItems: [
      { label: "كل المبيعات", href: "/sales/all" },
      { label: "إضافة رقم", href: "/sales/add" },
      { label: "قائمة نقطة البيع", href: "/sales/pos-list" },
      { label: "نقطة بيع", href: "/sales/pos" },
      { label: "إضافة مسودة", href: "/sales/add-draft" },
      { label: "قائمة المسودات", href: "/sales/drafts" },
      { label: "إضافة عرض سعر", href: "/sales/add-quote" },
      { label: "قائمة بيان الأسعار", href: "/sales/quotes" },
      { label: "قائمة مرتجع المبيعات", href: "/sales/returns" },
      { label: "الشيكات", href: "/sales/checks" },
      { label: "خصومات", href: "/sales/discounts" },
      { label: "استيراد المبيعات", href: "/sales/import" },
    ],
  },
  {
    icon: Warehouse,
    label: "تحويلات المخزون",
    hasDropdown: true,
    subItems: [
      { label: "قائمة تحويلات المخزون", href: "/stock-transfers/list" },
      { label: "إضافة تحويل مخزون", href: "/stock-transfers/add" },
    ],
  },
  {
    icon: Trash2,
    label: "المخزون التالف",
    hasDropdown: true,
    subItems: [
      { label: "قائمة المخزون التالف", href: "/damaged-stock/list" },
      { label: "أضف تالف", href: "/damaged-stock/add" },
    ],
  },
  {
    icon: DollarSign,
    label: "المصاريف",
    hasDropdown: true,
    subItems: [
      { label: "قائمة المصاريف", href: "/expenses/list" },
      { label: "اضافة للمصاريف", href: "/expenses/add" },
      { label: "فئات المصاريف", href: "/expenses/categories" },
    ],
  },
  {
    icon: ClipboardList,
    label: "إدارة الشيكات",
    hasDropdown: true,
    subItems: [
      { label: "قائمة الشيكات", href: "/checks/list" },
      { label: "إضافة شيك جديد", href: "/checks/add" },
    ],
  },
  {
    icon: FileText,
    label: "التقارير",
    hasDropdown: true,
    subItems: [
      { label: "تقرير الربح / الخسارة", href: "/reports/profit-loss" },
      { label: "مشتريات ومستودعات", href: "/reports/purchases-warehouses" },
      { label: "تقرير الفواتير", href: "/reports/invoices" },
      { label: "تقرير الموردين والعملاء", href: "/reports/contacts" },
      { label: "تقرير مخدومات العملاء", href: "/reports/customer-dues" },
      { label: "تقرير المخزون", href: "/reports/stock" },
      { label: "تقرير المخزون التالف", href: "/reports/damaged-stock" },
      { label: "المنتجات الشائعة", href: "/reports/trending-products" },
      { label: "المنتجات الأكثر مبيعا", href: "/reports/top-selling" },
      { label: "تقرير العناصر", href: "/reports/items" },
      { label: "تقرير مشتريات المنتجات", href: "/reports/product-purchases" },
      { label: "تقرير المشتريات", href: "/reports/purchases" },
      { label: "تقرير المبيعات", href: "/reports/sales" },
      { label: "تقرير المصاريف", href: "/reports/expenses" },
      { label: "تقرير المناوبة", href: "/reports/shifts" },
      { label: "تقرير مدينو المبيعات", href: "/reports/sales-debtors" },
      { label: "سجل الشيكات", href: "/reports/checks-log" },
    ],
  },
  { icon: Bell, label: "نماذج الإشعارات", href: "/notifications" },
  {
    icon: Settings,
    label: "إعدادات",
    hasDropdown: true,
    subItems: [
      { label: "إعدادات الشركة", href: "/settings/company" },
      { label: "فروع النشاط", href: "/settings/branches" },
      { label: "اعدادات الفواتير", href: "/settings/invoices" },
      { label: "إعدادات الباركود", href: "/settings/barcode" },
      { label: "طالبات البيضات", href: "/settings/payments" },
      { label: "معدلات الفواتير", href: "/settings/invoice-rates" },
      { label: "اشتراك", href: "/settings/subscription" },
    ],
  },
  {
    icon: UserCog,
    label: "إدارة الجرد المخزني",
    hasDropdown: true,
    subItems: [{ label: "قائمة الجرد", href: "/inventory-audit/list" }],
  },
  {
    icon: Store,
    label: "المتجر الإلكترونى",
    hasEmoji: true,
    hasDropdown: true,
    subItems: [
      { label: "اعدادات المتجر الإلكترونى", href: "/ecommerce/settings" },
      { label: "الطلبات", href: "/ecommerce/orders" },
      { label: "عرض المتجر", href: "/ecommerce/view" },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    "إدارة المستخدمين": pathname?.startsWith("/user-management") || false,
  });

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

  const isParentActive = (subItems?: SubItem[]) => {
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
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.hasDropdown ? (
              <button
                onClick={() => toggleDropdown(item.label)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isParentActive(item.subItems)
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
                        openDropdowns[item.label] ? "rotate-180" : ""
                      }`}
                    />
                  </>
                )}
              </button>
            ) : (
              <Link
                href={item.href || "#"}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive(item.href) || pathname === item.href
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
            )}
            {item.hasDropdown &&
              item.subItems &&
              openDropdowns[item.label] &&
              !collapsed && (
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
        ))}
      </nav>
    </aside>
  );
}
