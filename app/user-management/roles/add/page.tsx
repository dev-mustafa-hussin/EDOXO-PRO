"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Save, ArrowRight } from "lucide-react";

import { RoleService } from "@/services/role-service";
import { toast } from "sonner";

interface PermissionSection {
  id: string;
  title: string;
  permissions: {
    id: string;
    label: string;
    checked: boolean;
  }[];
}

export default function AddRolePage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [roleName, setRoleName] = useState("");

  const [permissionSections, setPermissionSections] = useState<
    PermissionSection[]
  >([
    {
      id: "others",
      title: "آخرون",
      permissions: [
        {
          id: "others_export",
          label:
            "عرض التصدير إلى الأزرار (csv / excel / print / pdf) على الجداول",
          checked: false,
        },
      ],
    },
    {
      id: "user",
      title: "المستخدم",
      permissions: [
        { id: "user_view", label: "عرض المستخدم", checked: false },
        { id: "user_add", label: "إضافة مستخدم", checked: false },
        { id: "user_edit", label: "تعديل المستخدم", checked: false },
        { id: "user_delete", label: "حذف المستخدم", checked: false },
      ],
    },
    {
      id: "roles",
      title: "الصلاحيات",
      permissions: [
        { id: "roles_view", label: "عرض الصلاحية", checked: false },
        { id: "roles_add", label: "إضافة دور", checked: false },
        { id: "roles_edit", label: "تعديل الدور", checked: false },
        { id: "roles_delete", label: "حذف الصلاحية", checked: false },
      ],
    },
    {
      id: "supplier",
      title: "المورد",
      permissions: [
        { id: "supplier_view_all", label: "عرض كل الموردين", checked: false },
        { id: "supplier_view_own", label: "عرض المورد الخاص", checked: false },
        { id: "supplier_add", label: "إضافة مورد", checked: false },
        { id: "supplier_edit", label: "تعديل المورد", checked: false },
        { id: "supplier_delete", label: "حذف المورد", checked: false },
      ],
    },
    {
      id: "customer",
      title: "العميل",
      permissions: [
        { id: "customer_view_all", label: "عرض كل العملاء", checked: false },
        { id: "customer_view_own", label: "عرض العميل الخاص", checked: false },
        {
          id: "customer_no_sale_1month",
          label: "عرض العملاء الذين لم يبيعوا من شهر واحد فقط",
          checked: false,
        },
        {
          id: "customer_no_sale_3months",
          label: "عرض العملاء الذين لم يبيعوا لمدة ثلاثة أشهر فقط",
          checked: false,
        },
        {
          id: "customer_no_sale_6months",
          label: "عرض العملاء الذين لم يبيعوا منذ ستة أشهر فقط",
          checked: false,
        },
        {
          id: "customer_no_sale_1year",
          label: "عرض العملاء الذين لم يبيعوا منذ عام واحد فقط",
          checked: false,
        },
        {
          id: "customer_view_regardless",
          label: "عرض العملاء بغض النظر عن بيعهم",
          checked: false,
        },
        { id: "customer_add", label: "إضافة عميل", checked: false },
        { id: "customer_edit", label: "تعديل العميل", checked: false },
        { id: "customer_delete", label: "حذف العميل", checked: false },
      ],
    },
    {
      id: "product",
      title: "المنتج",
      permissions: [
        { id: "product_view", label: "عرض المنتج", checked: false },
        { id: "product_add", label: "إضافة منتج", checked: false },
        { id: "product_edit", label: "تعديل المنتج", checked: false },
        { id: "product_delete", label: "حذف المنتج", checked: false },
        {
          id: "product_opening_stock",
          label: "أضف مخزون الإفتتاح",
          checked: false,
        },
        {
          id: "product_view_purchase_price",
          label: "عرض سعر الشراء",
          checked: false,
        },
      ],
    },
    {
      id: "purchases",
      title: "المشتريات",
      permissions: [
        {
          id: "purchases_view_all",
          label: "عرض كل عمليات الشراء",
          checked: false,
        },
        {
          id: "purchases_view_own",
          label: "عرض الشراء الخاص فقط",
          checked: false,
        },
        { id: "purchases_add", label: "إضافة عملية شراء", checked: false },
        { id: "purchases_edit", label: "تعديل عملية شراء", checked: false },
        { id: "purchases_delete", label: "حذف عملية شراء", checked: false },
        {
          id: "purchases_add_payment",
          label: "إضافة مدفوعات الشراء",
          checked: false,
        },
        {
          id: "purchases_edit_payment",
          label: "تحرير دفع الشراء",
          checked: false,
        },
        {
          id: "purchases_delete_payment",
          label: "حذف دفعة الشراء",
          checked: false,
        },
        {
          id: "purchases_update_status",
          label: "تحديث حالة الشراء",
          checked: false,
        },
      ],
    },
    {
      id: "stock_adjustment",
      title: "تعديل المخزون",
      permissions: [
        {
          id: "stock_adj_view_all",
          label: "عرض جميع تعديلات المخزون",
          checked: false,
        },
        {
          id: "stock_adj_view_own",
          label: "عرض تعديلات المخزون الخاصة",
          checked: false,
        },
        { id: "stock_adj_add", label: "إضافة تعديل مخزون", checked: false },
        { id: "stock_adj_edit", label: "تعديل تعديل مخزون", checked: false },
        { id: "stock_adj_delete", label: "حذف تعديل مخزون", checked: false },
      ],
    },
    {
      id: "stock_transfer",
      title: "تحويل المخزون",
      permissions: [
        {
          id: "stock_transfer_view_all",
          label: "عرض جميع تحويلات المخزون",
          checked: false,
        },
        {
          id: "stock_transfer_view_own",
          label: "عرض تحويلات المخزون الخاصة",
          checked: false,
        },
        {
          id: "stock_transfer_add",
          label: "إضافة تحويل مخزون",
          checked: false,
        },
        {
          id: "stock_transfer_edit",
          label: "تعديل تحويل مخزون",
          checked: false,
        },
        {
          id: "stock_transfer_delete",
          label: "حذف تحويل مخزون",
          checked: false,
        },
      ],
    },
    {
      id: "pos",
      title: "نقطة بيع",
      permissions: [
        {
          id: "pos_view",
          label: "عرض المبيعات عبر نقطة البيع",
          checked: false,
        },
        {
          id: "pos_add",
          label: "إضافة عملية بيع عبر نقطة البيع",
          checked: false,
        },
        {
          id: "pos_edit",
          label: "تعديل عملية بيع عبر نقطة البيع",
          checked: false,
        },
        {
          id: "pos_delete",
          label: "حذف عملية بيع عبر نقطة البيع",
          checked: false,
        },
        {
          id: "pos_edit_price",
          label: "تحرير سعر المنتج من شاشة POS",
          checked: false,
        },
        {
          id: "pos_edit_discount",
          label: "تحرير خصم المنتج من شاشة POS",
          checked: false,
        },
        {
          id: "pos_add_edit_payment",
          label: "إضافة/تحرير دفع",
          checked: false,
        },
        { id: "pos_print_invoice", label: "طباعة الفاتورة", checked: false },
        { id: "pos_disable_payment", label: "تعطيل الدفع", checked: false },
        { id: "pos_disable_draft", label: "تعطيل المسودة", checked: false },
        {
          id: "pos_disable_express",
          label: "تعطيل الدفع السريع",
          checked: false,
        },
        { id: "pos_disable_discount", label: "تعطيل الخصم", checked: false },
        {
          id: "pos_disable_suspend",
          label: "تعطيل تعليق البيع",
          checked: false,
        },
        { id: "pos_disable_credit", label: "تعطيل بيع الرصيد", checked: false },
        {
          id: "pos_disable_quotation",
          label: "تعطيل عرض السعر",
          checked: false,
        },
        { id: "pos_disable_card", label: "تعطيل البطاقة", checked: false },
      ],
    },
    {
      id: "sales",
      title: "المبيعات",
      permissions: [
        { id: "sales_view_all", label: "عرض كل عمليات البيع", checked: false },
        { id: "sales_view_own", label: "عرض بيع الخاصة فقط", checked: false },
        {
          id: "sales_view_paid",
          label: "عرض عمليات البيع المدفوعة فقط",
          checked: false,
        },
        {
          id: "sales_view_due",
          label: "عرض البيع المستحق فقط",
          checked: false,
        },
        {
          id: "sales_view_partial",
          label: "عرض عمليات البيع المدفوعة جزئيًا فقط",
          checked: false,
        },
        {
          id: "sales_view_overdue",
          label: "عرض عمليات البيع المتأخرة فقط",
          checked: false,
        },
        { id: "sales_add", label: "إضافة بيع", checked: false },
        { id: "sales_update", label: "تحديث البيع", checked: false },
        { id: "sales_delete", label: "حذف البيع", checked: false },
        {
          id: "sales_commission_view",
          label: "يمكن لوكيل العمولة عرض بيعه الخاص",
          checked: false,
        },
        { id: "sales_add_payment", label: "إضافة دفع بيع", checked: false },
        { id: "sales_edit_payment", label: "تحرير دفع البيع", checked: false },
        { id: "sales_delete_payment", label: "حذف دفع البيع", checked: false },
        {
          id: "sales_edit_price",
          label: "تعديل سعر المنتج من شاشة البيع",
          checked: false,
        },
        {
          id: "sales_edit_discount",
          label: "تعديل خصم المنتج من شاشة البيع",
          checked: false,
        },
        {
          id: "sales_discount_crud",
          label: "إضافة/تحرير/حذف خصم",
          checked: false,
        },
        {
          id: "sales_return_all",
          label: "الوصول إلى جميع عمليات إعادة البيع",
          checked: false,
        },
        {
          id: "sales_return_own",
          label: "الوصول إلى إعادة البيع الخاصة بالبيع",
          checked: false,
        },
        {
          id: "sales_edit_invoice_number",
          label: "تعديل رقم الفاتورة",
          checked: false,
        },
      ],
    },
    {
      id: "draft",
      title: "مسودة",
      permissions: [
        { id: "draft_view_all", label: "عرض كل المسودات", checked: false },
        { id: "draft_view_own", label: "عرض المسودات الخاصة", checked: false },
        { id: "draft_edit", label: "تحرير المسودة", checked: false },
        { id: "draft_delete", label: "حذف المسودة", checked: false },
      ],
    },
    {
      id: "quotation",
      title: "عرض سعر",
      permissions: [
        {
          id: "quotation_view_all",
          label: "عرض جميع عروض الأسعار",
          checked: false,
        },
        {
          id: "quotation_view_own",
          label: "عرض عروض الأسعار الخاصة",
          checked: false,
        },
        { id: "quotation_edit", label: "تحرير عرض السعر", checked: false },
        { id: "quotation_delete", label: "حذف عرض السعر", checked: false },
      ],
    },
    {
      id: "shipments",
      title: "الشحنات",
      permissions: [
        {
          id: "shipments_view_all",
          label: "الوصول إلى جميع الشحنات",
          checked: false,
        },
        {
          id: "shipments_view_own",
          label: "الوصول إلى الشحنات الخاصة",
          checked: false,
        },
        {
          id: "shipments_pending_only",
          label: "الوصول إلى الشحنات المعلقة فقط",
          checked: false,
        },
        {
          id: "shipments_commission",
          label: "يمكن للوكيل بالعمولة الوصول إلى الشحنات الخاصة بهم",
          checked: false,
        },
      ],
    },
    {
      id: "shift",
      title: "وردية",
      permissions: [
        { id: "shift_view", label: "عرض السجل النقدي", checked: false },
        { id: "shift_close", label: "إغلاق السجل النقدي", checked: false },
      ],
    },
    {
      id: "brand",
      title: "العلامة التجارية",
      permissions: [
        { id: "brand_view", label: "عرض العلامة التجارية", checked: false },
        { id: "brand_add", label: "إضافة علامة تجارية", checked: false },
        { id: "brand_edit", label: "تعديل العلامة التجارية", checked: false },
        { id: "brand_delete", label: "حذف العلامة التجارية", checked: false },
      ],
    },
    {
      id: "tax_rate",
      title: "نسبة الضريبة",
      permissions: [
        { id: "tax_view", label: "عرض نسبة الضريبة", checked: false },
        { id: "tax_add", label: "إضافة نسبة ضريبة", checked: false },
        { id: "tax_edit", label: "تعديل نسبة الضريبة", checked: false },
        { id: "tax_delete", label: "حذف نسبة الضريبة", checked: false },
      ],
    },
    {
      id: "unit",
      title: "الوحدة",
      permissions: [
        { id: "unit_view", label: "عرض الوحدة", checked: false },
        { id: "unit_add", label: "إضافة وحدة", checked: false },
        { id: "unit_edit", label: "تعديل الوحدة", checked: false },
        { id: "unit_delete", label: "حذف الوحدة", checked: false },
      ],
    },
    {
      id: "category",
      title: "القسم",
      permissions: [
        { id: "category_view", label: "عرض الفئة", checked: false },
        { id: "category_add", label: "إضافة فئة", checked: false },
        { id: "category_edit", label: "تعديل الفئة", checked: false },
        { id: "category_delete", label: "حذف الفئة", checked: false },
      ],
    },
    {
      id: "reports",
      title: "التقارير",
      permissions: [
        {
          id: "reports_purchase_sales",
          label: "عرض تقرير المشتريات والمبيعات",
          checked: false,
        },
        { id: "reports_tax", label: "عرض تقرير الضرائب", checked: false },
        {
          id: "reports_supplier_customer",
          label: "عرض تقرير الموردين والعملاء",
          checked: false,
        },
        { id: "reports_expense", label: "عرض تقرير المصروفات", checked: false },
        {
          id: "reports_profit_loss",
          label: "عرض تقرير الأرباح والخسائر",
          checked: false,
        },
        {
          id: "reports_stock",
          label: "عرض تقرير المخزون وتعديلاته وتقرير انتهاء الصلاحية",
          checked: false,
        },
        {
          id: "reports_trending",
          label: "عرض تقرير المنتجات الأكثر مبيعاً",
          checked: false,
        },
        { id: "reports_register", label: "عرض تقرير السجل", checked: false },
        {
          id: "reports_sales_rep",
          label: "عرض تقرير مندوبي المبيعات",
          checked: false,
        },
        {
          id: "reports_stock_value",
          label: "عرض قيمة مخزون المنتج",
          checked: false,
        },
      ],
    },
    {
      id: "settings",
      title: "الإعدادات",
      permissions: [
        {
          id: "settings_business",
          label: "الوصول إلى إعدادات النشاط التجاري",
          checked: false,
        },
        {
          id: "settings_barcode",
          label: "الوصول إلى إعدادات الباركود",
          checked: false,
        },
        {
          id: "settings_invoice",
          label: "الوصول إلى إعدادات الفواتير",
          checked: false,
        },
        { id: "settings_printers", label: "طابعات الوصول", checked: false },
      ],
    },
    {
      id: "expense",
      title: "مصروف",
      permissions: [
        {
          id: "expense_view_all",
          label: "الوصول إلى جميع النفقات",
          checked: false,
        },
        {
          id: "expense_view_own",
          label: "عرض النفقات الخاصة فقط",
          checked: false,
        },
        { id: "expense_add", label: "إضافة المصاريف", checked: false },
        { id: "expense_edit", label: "تعديل المصاريف", checked: false },
        { id: "expense_delete", label: "حذف المصروفات", checked: false },
      ],
    },
    {
      id: "home",
      title: "الصفحة الرئيسية",
      permissions: [
        {
          id: "home_view",
          label: "عرض بيانات الصفحة الرئيسية",
          checked: false,
        },
      ],
    },
    {
      id: "safes_banks",
      title: "الخزائن والبنوك",
      permissions: [
        { id: "safes_enable", label: "تمكين الحسابات", checked: false },
        { id: "safes_edit", label: "تحرير معاملة الحساب", checked: false },
        { id: "safes_delete", label: "حذف معاملة الحساب", checked: false },
      ],
    },
    {
      id: "selling_price_group",
      title: "الوصول إلى مجموعات أسعار البيع",
      permissions: [
        { id: "selling_default", label: "سعر البيع الافتراضي", checked: false },
      ],
    },
    {
      id: "accounting",
      title: "Accounting",
      permissions: [
        {
          id: "accounting_access",
          label: "الوصول إلى قسم المحاسبة",
          checked: false,
        },
        { id: "accounting_manage", label: "إدارة الحسابات", checked: false },
        {
          id: "accounting_view_journal",
          label: "عرض دفتر اليومية",
          checked: false,
        },
        {
          id: "accounting_add_journal",
          label: "اضافة قيد يومية",
          checked: false,
        },
        {
          id: "accounting_edit_journal",
          label: "تعديل قيد يومية",
          checked: false,
        },
        {
          id: "accounting_delete_journal",
          label: "حذف قيد يومية",
          checked: false,
        },
        { id: "accounting_link_op", label: "ربط العملية", checked: false },
        {
          id: "accounting_view_transfer",
          label: "عرض التحويل",
          checked: false,
        },
        { id: "accounting_add_transfer", label: "اضافة تحويل", checked: false },
        {
          id: "accounting_edit_transfer",
          label: "تعديل التحويل",
          checked: false,
        },
        {
          id: "accounting_delete_transfer",
          label: "حذف التحويل",
          checked: false,
        },
        { id: "accounting_budget", label: "ادارة الميزانية", checked: false },
        { id: "accounting_reports", label: "عرض التقارير", checked: false },
      ],
    },
    {
      id: "asset_management",
      title: "AssetManagement",
      permissions: [
        { id: "asset_view", label: "عرض الأصول", checked: false },
        { id: "asset_add", label: "إضافة الأصول", checked: false },
        { id: "asset_edit", label: "تحرير الأصل", checked: false },
        { id: "asset_delete", label: "حذف الأصل", checked: false },
        {
          id: "asset_view_all_maintenance",
          label: "عرض كل الصيانة",
          checked: false,
        },
        {
          id: "asset_view_own_maintenance",
          label: "عرض الصيانة الخاصة بك",
          checked: false,
        },
      ],
    },
    {
      id: "crm",
      title: "Crm",
      permissions: [
        {
          id: "crm_all_followups",
          label: "الوصول إلى جميع المتابعة",
          checked: false,
        },
        {
          id: "crm_own_followups",
          label: "الوصول إلى المتابعة الخاصة",
          checked: false,
        },
        {
          id: "crm_all_leads",
          label: "الوصول إلى جميع العملاء المحتملين",
          checked: false,
        },
        {
          id: "crm_own_leads",
          label: "الوصول إلى العملاء المحتملين الخاص بك",
          checked: false,
        },
        {
          id: "crm_all_campaigns",
          label: "الوصول إلى جميع الحملات",
          checked: false,
        },
        {
          id: "crm_own_campaigns",
          label: "الوصول إلى الحملات الخاصة بك",
          checked: false,
        },
        {
          id: "crm_contact_login",
          label: "الوصول إلى تسجيل الدخول لجهة الاتصال",
          checked: false,
        },
        { id: "crm_sources", label: "مصادر الوصول", checked: false },
        {
          id: "crm_life_stage",
          label: "الوصول إلى مرحلة الحياة",
          checked: false,
        },
        { id: "crm_proposal", label: "اقتراح الوصول", checked: false },
      ],
    },
    {
      id: "essentials",
      title: "Essentials",
      permissions: [
        {
          id: "ess_leave_types",
          label: "إدارة أنواع الإجازات",
          checked: false,
        },
        {
          id: "ess_all_leave",
          label: "إدارة جميع طلبات الإجازات",
          checked: false,
        },
        {
          id: "ess_own_leave",
          label: "إدارة الإجازات الشخصية",
          checked: false,
        },
        {
          id: "ess_approve_leave",
          label: "الموافقة على الإجازة",
          checked: false,
        },
        {
          id: "ess_all_attendance",
          label: "إدارة سجلات الحضور للجميع",
          checked: false,
        },
        {
          id: "ess_own_attendance",
          label: "عرض سجل الحضور الشخصي",
          checked: false,
        },
        {
          id: "ess_web_clock",
          label: "السماح للموظفين بتسجيل الحضور من المتصفح (الويب)",
          checked: false,
        },
        {
          id: "ess_api_clock",
          label: "السماح للموظفين بتسجيل الحضور من التطبيق (API)",
          checked: false,
        },
        { id: "ess_view_salary", label: "عرض بند راتب", checked: false },
        { id: "ess_add_salary", label: "إضافة بند راتب", checked: false },
        { id: "ess_departments", label: "إدارة الأقسام", checked: false },
        {
          id: "ess_designations",
          label: "إدارة المسميات الوظيفية",
          checked: false,
        },
        { id: "ess_view_payroll", label: "عرض كل الرواتب", checked: false },
        { id: "ess_issue_payroll", label: "إصدار راتب", checked: false },
        { id: "ess_edit_payroll", label: "تعديل الراتب", checked: false },
        { id: "ess_delete_payroll", label: "حذف الراتب", checked: false },
        {
          id: "ess_assign_task",
          label: "إسناد المهمة لموظف آخر",
          checked: false,
        },
        { id: "ess_add_todo", label: "إضافة مهام", checked: false },
        { id: "ess_edit_todo", label: "تحرير مهام", checked: false },
        { id: "ess_delete_todo", label: "حذف مهام", checked: false },
        { id: "ess_new_message", label: "إنشاء رسالة جديدة", checked: false },
        { id: "ess_view_message", label: "عرض الرسالة", checked: false },
        {
          id: "ess_sales_targets",
          label: "وصول إلى أهداف المبيعات",
          checked: false,
        },
        { id: "ess_edit_kb", label: "تحرير قاعدة المعرفة", checked: false },
        { id: "ess_delete_kb", label: "حذف قاعدة المعرفة", checked: false },
      ],
    },
    {
      id: "installment",
      title: "Installment",
      permissions: [
        { id: "inst_view", label: "عرض الأقساط", checked: false },
        { id: "inst_add", label: "إضافة قسط", checked: false },
        { id: "inst_edit", label: "تحرير قسط", checked: false },
        { id: "inst_delete", label: "حذف قسط", checked: false },
        { id: "inst_record_payment", label: "تسجيل دفعة قسط", checked: false },
        { id: "inst_delete_payment", label: "حذف دفعة قسط", checked: false },
        { id: "inst_add_system", label: "إضافة نظام", checked: false },
        { id: "inst_edit_system", label: "تحرير نظام", checked: false },
        { id: "inst_delete_system", label: "حذف نظام", checked: false },
      ],
    },
    {
      id: "inventory_management",
      title: "InventoryManagement",
      permissions: [
        { id: "inv_view", label: "عرض إدارة المخزون", checked: false },
        { id: "inv_remove", label: "حذف عنصر المخزون", checked: false },
      ],
    },
    {
      id: "manufacturing",
      title: "Manufacturing",
      permissions: [
        { id: "mfg_view_recipe", label: "عرض الوصفة", checked: false },
        { id: "mfg_add_recipe", label: "إضافة وصفة", checked: false },
        { id: "mfg_edit_recipe", label: "تحرير الوصفة", checked: false },
        { id: "mfg_production", label: "عرض الإنتاج", checked: false },
      ],
    },
    {
      id: "project",
      title: "Project",
      permissions: [
        { id: "project_create", label: "إنشاء مشروع", checked: false },
        { id: "project_edit", label: "تحرير المشروع", checked: false },
        { id: "project_delete", label: "حذف المشروع", checked: false },
      ],
    },
    {
      id: "spreadsheet",
      title: "Spreadsheet",
      permissions: [
        {
          id: "spreadsheet_access",
          label: "الوصول إلى جدول البيانات",
          checked: false,
        },
        {
          id: "spreadsheet_create",
          label: "إنشاء جدول بيانات",
          checked: false,
        },
      ],
    },
    {
      id: "superadmin",
      title: "Superadmin",
      permissions: [
        {
          id: "superadmin_subscriptions",
          label: "اشتراكات حزمة الوصول",
          checked: false,
        },
      ],
    },
    {
      id: "woocommerce",
      title: "Woocommerce",
      permissions: [
        {
          id: "woo_sync_categories",
          label: "فئات منتجات المزامنة",
          checked: false,
        },
        { id: "woo_sync_products", label: "منتجات المزامنة", checked: false },
        { id: "woo_sync_orders", label: "أوامر المزامنة", checked: false },
        { id: "woo_map_tax", label: "أسعار ضريبة الخريطة", checked: false },
        {
          id: "woo_settings",
          label: "الوصول إلى إعدادات Woocommerce API",
          checked: false,
        },
      ],
    },
  ]);

  const handleSelectAll = (sectionId: string) => {
    setPermissionSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          const allChecked = section.permissions.every((p) => p.checked);
          return {
            ...section,
            permissions: section.permissions.map((p) => ({
              ...p,
              checked: !allChecked,
            })),
          };
        }
        return section;
      })
    );
  };

  const handlePermissionChange = (sectionId: string, permissionId: string) => {
    setPermissionSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            permissions: section.permissions.map((p) =>
              p.id === permissionId ? { ...p, checked: !p.checked } : p
            ),
          };
        }
        return section;
      })
    );
  };

  const handleSave = () => {
    // Save logic here
    router.push("/user-management/roles");
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>الرئيسية</span>
            <span>/</span>
            <span>إدارة المستخدمين</span>
            <span>/</span>
            <span>الصلاحيات</span>
            <span>/</span>
            <span className="text-blue-600">إضافة صلاحية</span>
          </div>

          {/* Page Title */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-800">
                إضافة صلاحية جديدة
              </h1>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/user-management/roles")}
              className="gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              رجوع للصلاحيات
            </Button>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Role Name */}
            <div className="mb-8">
              <Label className="text-base font-semibold text-gray-700 mb-2 block">
                اسم الصلاحية <span className="text-red-500">*</span>
              </Label>
              <Input
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="أدخل اسم الصلاحية"
                className="max-w-md"
              />
            </div>

            {/* Permissions Section Title */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">
                الأذونات
              </h2>
            </div>

            {/* Permission Sections */}
            <div className="space-y-6">
              {permissionSections.map((section) => (
                <div
                  key={section.id}
                  className="border rounded-lg overflow-hidden"
                >
                  {/* Section Header */}
                  <div className="bg-gray-100 px-4 py-3 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700">
                      {section.title}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectAll(section.id)}
                      className="text-xs"
                    >
                      {section.permissions.every((p) => p.checked)
                        ? "إلغاء تحديد الكل"
                        : "تحديد الكل"}
                    </Button>
                  </div>

                  {/* Permissions Grid */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {section.permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center gap-2"
                      >
                        <Checkbox
                          id={permission.id}
                          checked={permission.checked}
                          onCheckedChange={() =>
                            handlePermissionChange(section.id, permission.id)
                          }
                        />
                        <Label
                          htmlFor={permission.id}
                          className="text-sm text-gray-600 cursor-pointer"
                        >
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 gap-2 px-8"
                disabled={!roleName || isLoading}
              >
                {isLoading ? (
                  "جاري الحفظ..."
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    حفظ الصلاحية
                  </>
                )}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
