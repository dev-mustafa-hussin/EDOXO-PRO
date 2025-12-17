"use client";

import { useEffect, useState } from "react";
import { AuthService } from "@/services/auth-service";

export function usePermission() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = () => {
    // Try to get from local storage first (fastest)
    const storedUser = localStorage.getItem("user");
    const storedPermissions = localStorage.getItem("permissions");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setRole(user.roles?.[0]?.name || ""); // Assuming Spatie structure
    }

    if (storedPermissions) {
      setPermissions(JSON.parse(storedPermissions));
      setLoading(false);
    }

    // Optionally fetch fresh if needed, but for now relies on what Auth saved
  };

  const can = (permission: string) => {
    if (role === "Super Admin") return true;
    return permissions.includes(permission);
  };

  const hasRole = (roleName: string) => {
    return role === roleName;
  };

  return { can, hasRole, loading, role, permissions };
}
