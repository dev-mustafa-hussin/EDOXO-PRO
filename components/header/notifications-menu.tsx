"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NotificationsMenu() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n: any) => !n.read_at).length);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/read`);
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post("/notifications/read-all");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: new Date() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <button className="p-2 hover:bg-blue-600 rounded relative transition-colors">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full text-xs flex items-center justify-center text-black font-bold ring-2 ring-blue-600">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>الإشعارات</span>
          {unreadCount > 0 && (
            <span
              onClick={markAllAsRead}
              className="text-xs text-blue-600 cursor-pointer hover:underline"
            >
              تحديد الكل كمقروء
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              لا توجد إشعارات جديدة
            </div>
          ) : (
            notifications.map((notif: any) => (
              <DropdownMenuItem
                key={notif.id}
                className={`cursor-pointer flex items-start gap-3 p-3 ${
                  !notif.read_at ? "bg-blue-50" : ""
                }`}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="bg-blue-100 p-2 rounded-full mt-1">
                  <Bell className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p
                    className={`text-sm ${
                      !notif.read_at ? "font-semibold" : ""
                    }`}
                  >
                    {notif.data.message || "إشعار جديد"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(notif.created_at).toLocaleString("ar-EG")}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
