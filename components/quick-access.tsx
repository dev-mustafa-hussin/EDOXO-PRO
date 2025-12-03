import {
  FileText,
  RotateCcw,
  ShoppingCart,
  CreditCard,
  Store,
  Users,
  Wallet,
  FolderOpen,
  Briefcase,
  Truck,
} from "lucide-react"

const quickAccessItems = [
  { icon: Store, label: "المتجر الإلكترونى", color: "bg-purple-100", iconColor: "text-purple-600" },
  { icon: CreditCard, label: "نقاط البيع", color: "bg-blue-600", iconColor: "text-white" },
  { icon: FileText, label: "فاتورة مبيعات", color: "bg-orange-100", iconColor: "text-orange-500" },
  { icon: RotateCcw, label: "مرتجع مبيعات", color: "bg-teal-100", iconColor: "text-teal-500" },
  { icon: ShoppingCart, label: "فاتورة مشتريات", color: "bg-green-100", iconColor: "text-green-600" },
  { icon: Users, label: "العملاء", color: "bg-red-100", iconColor: "text-red-500" },
  { icon: Truck, label: "الموردين", color: "bg-gray-100", iconColor: "text-gray-500" },
  { icon: Wallet, label: "المصروفات", color: "bg-gray-100", iconColor: "text-gray-500" },
  { icon: FolderOpen, label: "الحسابات العامة", color: "bg-blue-100", iconColor: "text-blue-500" },
  { icon: Briefcase, label: "إدارة المشاريع", color: "bg-teal-100", iconColor: "text-teal-500" },
]

export function QuickAccess() {
  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
      <div className="flex items-center gap-2 justify-end mb-6">
        <h2 className="text-lg font-semibold text-gray-800">الوصول السريع</h2>
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
          <CreditCard className="w-4 h-4 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {quickAccessItems.map((item, index) => (
          <button
            key={index}
            className="flex flex-col items-center gap-2 p-4 rounded-lg hover:shadow-md transition-all duration-200 hover:scale-105"
          >
            <div className={`w-14 h-14 ${item.color} rounded-lg flex items-center justify-center`}>
              <item.icon className={`w-6 h-6 ${item.iconColor}`} />
            </div>
            <span className="text-sm text-gray-600">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
