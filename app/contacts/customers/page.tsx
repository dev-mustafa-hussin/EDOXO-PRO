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
import { useContactStore } from "@/store/contact-store";
import { Contact } from "@/types/contacts";

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
    key: "unpaidInvoices",
    label: "مجموع الفواتير غير المدفوعة",
    sortable: true,
  },
  {
    key: "salesReturnsTotal",
    label: "اجمالى مستحق مرتجع المبيعات",
    sortable: true,
  },
];

export default function CustomersPage() {
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
  const [filterSalesReturns, setFilterSalesReturns] = useState(false);
  const [filterPreviousBalance, setFilterPreviousBalance] = useState(false);
  const [filterOpeningBalance, setFilterOpeningBalance] = useState(false);

  // Store integration
  const {
    contacts,
    fetchContacts,
    deleteContact,
    getContactsByType,
    isLoading,
  } = useContactStore();

  useEffect(() => {
    if (contacts.length === 0) {
      fetchContacts();
    }
  }, [fetchContacts, contacts.length]);

  const customers = getContactsByType("customer");

  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const exportToCSV = () => {
    // simplified implementation
    alert("Export feature coming soon");
  };

  const exportToExcel = () => {
    // simplified implementation
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
              <h1 className="text-2xl font-bold text-gray-800">العملاء</h1>
              <p className="text-sm text-gray-500">
                إدارة جهات الاتصال الخاصة بك ({customers.length})
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
                    <span className="text-gray-700">مرتجع مبيعات</span>
                    <input
                      type="checkbox"
                      checked={filterSalesReturns}
                      onChange={(e) => setFilterSalesReturns(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-gray-700">مستحق دفع المبيعات</span>
                    <input
                      type="checkbox"
                      checked={filterPaymentDue}
                      onChange={(e) => setFilterPaymentDue(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Header with Add Button */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <Link href="/contacts/customers/add">
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
                  ) : customers.length === 0 ? (
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
                    customers.map((customer: Contact) => (
                      <tr
                        key={customer.id}
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
                                onClick={() => deleteContact(customer.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        )}
                        {visibleColumns.contactId && (
                          <td className="px-4 py-3 text-right">
                            {customer.id.substring(0, 8)}
                          </td>
                        )}
                        {visibleColumns.name && (
                          <td className="px-4 py-3 text-right font-medium">
                            {customer.name}
                          </td>
                        )}
                        {visibleColumns.businessName && (
                          <td className="px-4 py-3 text-right">
                            {customer.companyName || "-"}
                          </td>
                        )}
                        {visibleColumns.email && (
                          <td className="px-4 py-3 text-right">
                            {customer.email || "-"}
                          </td>
                        )}
                        {visibleColumns.taxNumber && (
                          <td className="px-4 py-3 text-right">
                            {customer.taxNumber || "-"}
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
                            {new Date(customer.createdAt).toLocaleDateString(
                              "ar-EG"
                            )}
                          </td>
                        )}
                        {visibleColumns.address && (
                          <td className="px-4 py-3 text-right">
                            {customer.address || "-"}
                          </td>
                        )}
                        {visibleColumns.mobile && (
                          <td className="px-4 py-3 text-right">
                            {customer.phone}
                          </td>
                        )}
                        {visibleColumns.unpaidInvoices && (
                          <td className="px-4 py-3 text-right">0.00</td>
                        )}
                        {visibleColumns.salesReturnsTotal && (
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
                عرض {customers.length} من {customers.length} إدخالات
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
