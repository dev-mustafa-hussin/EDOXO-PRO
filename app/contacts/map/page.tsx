import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header
        onToggleSidebar={() => {}}
        onOpenCalculator={() => {}}
        onOpenProfit={() => {}}
      />
      <div className="flex">
        <Sidebar collapsed={false} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">خريطة جهات الاتصال</h1>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-[600px] flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">الخريطة ستظهر هنا</p>
          </div>
        </main>
      </div>
    </div>
  );
}
