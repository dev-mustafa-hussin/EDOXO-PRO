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
  Bell,
  LucideIcon,
} from "lucide-react";
import { UserRole } from "@/types/auth";

export interface SubItem {
  label: string;
  href: string;
}

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  href?: string;
  hasEmoji?: boolean;
  hasDropdown?: boolean;
  subItems?: SubItem[];
  allowedRoles?: UserRole[];
}

export const menuItems: MenuItem[] = [
  {
    icon: Home,
    label: "الرئيسية",
    href: "/",
    allowedRoles: ["admin", "manager", "cashier"],
  },
  {
    icon: Users,
    label: "إدارة المستخدمين",
    hasDropdown: true,
    allowedRoles: ["admin"],
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
    allowedRoles: ["admin", "manager"],
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
    allowedRoles: ["admin", "manager"],
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
    allowedRoles: ["admin", "manager"],
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
    allowedRoles: ["admin", "cashier", "manager"],
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
    allowedRoles: ["admin", "manager"],
    subItems: [
      { label: "قائمة تحويلات المخزون", href: "/stock-transfers/list" },
      { label: "إضافة تحويل مخزون", href: "/stock-transfers/add" },
    ],
  },
  {
    icon: Trash2,
    label: "المخزون التالف",
    hasDropdown: true,
    allowedRoles: ["admin", "manager"],
    subItems: [
      { label: "قائمة المخزون التالف", href: "/damaged-stock/list" },
      { label: "أضف تالف", href: "/damaged-stock/add" },
    ],
  },
  {
    icon: DollarSign,
    label: "المصاريف",
    hasDropdown: true,
    allowedRoles: ["admin"],
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
    allowedRoles: ["admin", "manager"],
    subItems: [
      { label: "قائمة الشيكات", href: "/checks/list" },
      { label: "إضافة شيك جديد", href: "/checks/add" },
    ],
  },
  {
    icon: FileText,
    label: "التقارير",
    hasDropdown: true,
    allowedRoles: ["admin", "manager", "cashier"],
    subItems: [
      { label: "لوحة التقارير (جديد)", href: "/reports" },
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
  {
    icon: Bell,
    label: "نماذج الإشعارات",
    href: "/notifications",
    allowedRoles: ["admin"],
  },
  {
    icon: Settings,
    label: "إعدادات",
    hasDropdown: true,
    allowedRoles: ["admin"],
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
    allowedRoles: ["admin", "manager"],
    subItems: [{ label: "قائمة الجرد", href: "/inventory-audit/list" }],
  },
  {
    icon: Store,
    label: "المتجر الإلكترونى",
    hasEmoji: true,
    hasDropdown: true,
    allowedRoles: ["admin"],
    subItems: [
      { label: "اعدادات المتجر الإلكترونى", href: "/ecommerce/settings" },
      { label: "الطلبات", href: "/ecommerce/orders" },
      { label: "عرض المتجر", href: "/ecommerce/view" },
    ],
  },
];
