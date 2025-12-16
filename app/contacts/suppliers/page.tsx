"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  FileSpreadsheet,
  FileText,
  Printer,
  Columns,
  ChevronUp,
  ChevronDown,
  Filter,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { SupplierService, Supplier } from "@/services/supplier-service";
import { toast } from "sonner";

const columns = [
  { key: "action", label: "خيار", sortable: false },
  { key: "contactId", label: "معرف الاتصال", sortable: true },
  { key: "name", label: "الإسم", sortable: true },
  { key: "businessName", label: "اسم النشاط", sortable: true },
  { key: "email", label: "البريد الإلكتروني", sortable: true },
  { key: "taxNumber", label: "الرقم الضريبي", sortable: true },
  { key: "paymentPeriod", label: "فترة الدفع", sortable: true },
  { key: "openingBalance", label: "الرصيد الافتتاحي", sortable: true },
  { key: "previousBalance", label: "الرصيد المسبق", sortable: true },
  { key: "addedOn", label: "وأضاف في", sortable: true },
  { key: "address", label: "العنوان", sortable: true },
  { key: "mobile", label: "الموبايل", sortable: true },
  {
    key: "unpaidPurchases",
    label: "مجموع المشتريات غير المدفوعة",
    sortable: true,
  },
  {
    key: "purchaseReturnsTotal",
    label: "اجمالى مستحق مرتجع المشتريات",
    sortable: true,
  },
];

export default function SuppliersPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    Object.fromEntries(columns.map((col) => [col.key, true]))
  );
  const [showColumnVisibility, setShowColumnVisibility] = useState(false);

  // Filter states
  const [filterPaymentDue, setFilterPaymentDue] = useState(false);
  const [filterPurchaseReturns, setFilterPurchaseReturns] = useState(false);
  const [filterPreviousBalance, setFilterPreviousBalance] = useState(false);
  const [filterOpeningBalance, setFilterOpeningBalance] = useState(false);
  const [filterStatus, setFilterStatus] = useState("لا احد");
  const [filterAssignedTo, setFilterAssignedTo] = useState("لا احد");

  // Store integration
  // Local state for suppliers
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const data = await SupplierService.getAll();
      setSuppliers(data);
    } catch (error) {
      console.error(error);
      toast.error("فشل في جلب بيانات الموردين");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المورد؟")) return;
    try {
      await SupplierService.delete(id.toString());
      toast.success("تم حذف المورد بنجاح");
      fetchSuppliers(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error("فشل حذف المورد");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const exportToCSV = () => {
    alert("Export feature coming soon");
  };

  const exportToExcel = () => {
    alert("Export feature coming soon");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenCalculator={() => {}}
        onOpenProfit={() => {}}
      />

      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} />

        <main className="flex-1 p-6">
          {/* Page Title */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">الموردين</h1>
              <p className="text-sm text-gray-500">
                إدارة جهات الاتصال الخاصة بك ({suppliers.length})
              </p>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-lg border border-gray-200 mb-4">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="w-full flex items-center justify-end gap-2 p-4 text-blue-600 hover:bg-gray-50"
            >
              <span className="font-medium">التصفية</span>
              <Filter className="w-5 h-5" />
            </button>

            {filterOpen && (
              <div className="border-t border-gray-200 p-6">
                {/* Checkboxes Row */}
                <div className="flex flex-wrap gap-8 mb-6 justify-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-gray-700">الرصيد الافتتاحي</span>
                    <input
                      type="checkbox"
                      checked={filterOpeningBalance}
                      onChange={(e) =>
                        setFilterOpeningBalance(e.target.checked)
                      }
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-gray-700">الرصيد المسبق</span>
                    <input
                      type="checkbox"
                      checked={filterPreviousBalance}
                      onChange={(e) =>
                        setFilterPreviousBalance(e.target.checked)
                      }
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-gray-700">مرتجع مشتريات</span>
                    <input
                      type="checkbox"
                      checked={filterPurchaseReturns}
                      onChange={(e) =>
                        setFilterPurchaseReturns(e.target.checked)
                      }
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-gray-700">مستحق دفع المشتريات</span>
                    <input
                      type="checkbox"
                      checked={filterPaymentDue}
                      onChange={(e) => setFilterPaymentDue(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </label>
                </div>

                {/* Dropdowns Row */}
                <div className="flex flex-wrap gap-8 justify-end items-end">
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 text-sm">من تاريخ:</label>
                    <Input type="date" className="text-right" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 text-sm">إلى تاريخ:</label>
                    <Input type="date" className="text-right" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 text-sm">الحالة:</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="border border-gray-300 rounded-md px-4 py-2 min-w-[200px] text-right"
                    >
                      <option value="لا احد">لا احد</option>
                      <option value="نشط">نشط</option>
                      <option value="غير نشط">غير نشط</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 text-sm">
                      Assigned to:
                    </label>
                    <select
                      value={filterAssignedTo}
                      onChange={(e) => setFilterAssignedTo(e.target.value)}
                      className="border border-gray-300 rounded-md px-4 py-2 min-w-[200px] text-right"
                    >
                      <option value="لا احد">لا احد</option>
                      <option value="محمد مجدى محمد مجدى محمد مجدى">
                        محمد مجدى محمد مجدى محمد مجدى
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Header with Add Button */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <Link href="/contacts/suppliers/add">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  إضافة
                </Button>
              </Link>
              <span className="text-gray-600 text-sm">
                كل جهات الاتصال الخاصة بك
              </span>
            </div>

            {/* Toolbar */}
            <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
              {/* Left side - Search */}
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="بحث ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 text-right"
                />
              </div>

              {/* Right side - Action buttons and entries */}
              <div className="flex items-center gap-3">
                {/* Column Visibility */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setShowColumnVisibility(!showColumnVisibility)
                    }
                    className="flex items-center gap-1"
                  >
                    <Columns className="w-4 h-4" />
                    رؤية العمود
                  </Button>
                  {showColumnVisibility && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3 min-w-[200px] max-h-[300px] overflow-y-auto">
                      {columns.map((col) => (
                        <label
                          key={col.key}
                          className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={visibleColumns[col.key]}
                            onChange={() => toggleColumnVisibility(col.key)}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-700">
                            {col.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="flex items-center gap-1 bg-transparent"
                >
                  <Printer className="w-4 h-4" />
                  طباعة
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToExcel}
                  className="flex items-center gap-1 bg-transparent"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  تصدير إلى Excel
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToCSV}
                  className="flex items-center gap-1 bg-transparent"
                >
                  <FileText className="w-4 h-4" />
                  تصدير إلى CSV
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {columns
                      .filter((col) => visibleColumns[col.key])
                      .map((col) => (
                        <th
                          key={col.key}
                          className="px-4 py-3 text-right text-sm font-medium text-gray-700 whitespace-nowrap"
                        >
                          <div className="flex items-center justify-end gap-1">
                            {col.label}
                            {col.sortable && (
                              <div className="flex flex-col">
                                <ChevronUp className="w-3 h-3 text-gray-400" />
                                <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                              </div>
                            )}
                          </div>
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="text-center py-8 text-gray-400"
                      >
                        جاري التحميل...
                      </td>
                    </tr>
                  ) : suppliers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={
                          columns.filter((col) => visibleColumns[col.key])
                            .length
                        }
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        لا توجد بيانات متاحة في الجدول
                      </td>
                    </tr>
                  ) : (
                    suppliers.map((supplier: Supplier) => (
                      <tr
                        key={supplier.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        {visibleColumns.action && (
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(supplier.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        )}
                        {visibleColumns.contactId && (
                          <td className="px-4 py-3 text-right">
                            {supplier.id.toString()}
                          </td>
                        )}
                        {visibleColumns.name && (
                          <td className="px-4 py-3 text-right font-medium">
                            {supplier.name}
                          </td>
                        )}
                        {visibleColumns.businessName && (
                          <td className="px-4 py-3 text-right">
                            {supplier.business_name || "-"}
                          </td>
                        )}
                        {visibleColumns.email && (
                          <td className="px-4 py-3 text-right">
                            {supplier.email || "-"}
                          </td>
                        )}
                        {visibleColumns.taxNumber && (
                          <td className="px-4 py-3 text-right">
                            {supplier.taxNumber || "-"}
                          </td>
                        )}

                        {/* Default placeholders for fields not in our simple mock model yet */}
                        {visibleColumns.paymentPeriod && (
                          <td className="px-4 py-3 text-right">-</td>
                        )}
                        {visibleColumns.openingBalance && (
                          <td className="px-4 py-3 text-right">0.00</td>
                        )}
                        {visibleColumns.previousBalance && (
                          <td className="px-4 py-3 text-right">0.00</td>
                        )}
                        {visibleColumns.addedOn && (
                          <td className="px-4 py-3 text-right">
                            {supplier.created_at ? new Date(supplier.created_at).toLocaleDateString("ar-EG") : "-"}
                          </td>
                        )}
                        {visibleColumns.address && (
                          <td className="px-4 py-3 text-right">
                            {supplier.address || "-"}
                          </td>
                        )}
                        {visibleColumns.mobile && (
                          <td className="px-4 py-3 text-right">
                            {supplier.phone}
                          </td>
                        )}
                        {visibleColumns.unpaidPurchases && (
                          <td className="px-4 py-3 text-right">0.00</td>
                        )}
                        {visibleColumns.purchaseReturnsTotal && (
                          <td className="px-4 py-3 text-right">0.00</td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  السابق
                </Button>
                <Button variant="outline" size="sm" disabled>
                  التالى
                </Button>
              </div>
              <span className="text-sm text-gray-600">
                عرض {suppliers.length} من {suppliers.length} إدخالات
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Daftar | Cloud ERP, Accounting, Sales, Inventory Software -{" "}
            <span className="text-blue-600">V6.9</span> | Copyright © 2025 All
            rights reserved.
          </div>
        </main>
      </div>
    </div>
  );
}
