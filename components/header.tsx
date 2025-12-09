"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import {
  Bell,
  Settings,
  Grid3X3,
  QrCode,
  Calendar,
  Calculator,
  Package,
  CreditCard,
  DollarSign,
  MoreHorizontal,
  PanelRightClose,
  User as UserIcon,
  LogOut,
  ChevronDown,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenCalculator: () => void;
  onOpenProfit: () => void;
}

export function Header({
  onToggleSidebar,
  onOpenCalculator,
  onOpenProfit,
}: HeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          // If no token, maybe we shouldn't show the user part or show "Guest"
          return;
        }

        // We can try to get from localStorage first to avoid flicker if we saved it there (future optimization)
        // But for now, let's fetch fresh
        const response = await api.get("/auth/user");
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user", error);
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          // Token might be invalid
          localStorage.removeItem("token");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="bg-[#2563eb] text-white h-12 flex items-center justify-between px-4 sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-blue-600 rounded transition-colors"
          title="طي/توسيع القائمة"
        >
          <PanelRightClose className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-sm font-bold tracking-wide">EDOXO PRO</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-blue-600 rounded transition-colors hidden md:block">
          <Grid3X3 className="w-4 h-4" />
        </button>
        <button className="p-2 hover:bg-blue-600 rounded transition-colors hidden md:block">
          <Settings className="w-4 h-4" />
        </button>
        <button className="p-2 hover:bg-blue-600 rounded transition-colors hidden md:block">
          <QrCode className="w-4 h-4" />
        </button>

        <div className="hidden md:flex items-center gap-2 text-sm hover:bg-blue-600 px-2 py-1 rounded cursor-pointer transition-colors">
          <span>نقاط البيع</span>
          <CreditCard className="w-4 h-4" />
        </div>

        <div className="hidden md:flex items-center gap-2 text-sm hover:bg-blue-600 px-2 py-1 rounded cursor-pointer transition-colors">
          <span>المنتجات</span>
          <Package className="w-4 h-4" />
        </div>

        <button
          onClick={onOpenCalculator}
          className="p-2 hover:bg-blue-600 rounded transition-colors"
          title="آلة حاسبة"
        >
          <Calculator className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenProfit}
          className="hidden md:flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 px-3 py-1 rounded transition-colors shadow-sm"
          title="ربح اليوم"
        >
          <DollarSign className="w-4 h-4" />
          <span>الربح اليومي</span>
        </button>

        <div className="hidden lg:flex items-center gap-2 text-sm bg-blue-700 px-3 py-1 rounded border border-blue-600">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString("en-GB")}</span>
        </div>

        <button className="p-2 hover:bg-blue-600 rounded relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full text-xs flex items-center justify-center text-black font-bold ring-2 ring-blue-600">
            2
          </span>
        </button>

        <button className="p-2 hover:bg-blue-600 rounded transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 text-sm hover:bg-blue-600 py-1 px-2 rounded cursor-pointer transition-colors select-none">
              <Avatar className="w-8 h-8 border-2 border-white/20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-blue-800 text-white text-xs">
                  {user ? getInitials(user.name) : "..."}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline-block font-medium max-w-[150px] truncate">
                {loading
                  ? "جاري التحميل..."
                  : user
                  ? `مرحبا, ${user.name}`
                  : "زائر"}
              </span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" dir="rtl">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || "زائر"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <UserIcon className="ml-2 h-4 w-4" />
              <span>الملف الشخصي</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="ml-2 h-4 w-4" />
              <span>الإعدادات</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="ml-2 h-4 w-4" />
              <span>تسجيل الخروج</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
