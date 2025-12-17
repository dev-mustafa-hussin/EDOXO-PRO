"use client";

import { ReactNode } from "react";
import { usePermission } from "@/hooks/use-permission";

import AccessDeniedPage from "@/components/access-denied";

interface PermissionGuardProps {
  children: ReactNode;
  permission: string;
  requireAll?: boolean;
  fallback?: ReactNode;
  showAccessDenied?: boolean; // New prop to explicitly show the full page
}

export const PermissionGuard = ({
  children,
  permission,
  fallback = null,
  showAccessDenied = false,
}: PermissionGuardProps) => {
  const { can, loading } = usePermission();

  if (loading) return null;

  if (can(permission)) {
    return <>{children}</>;
  }

  if (showAccessDenied) {
    return <AccessDeniedPage />;
  }

  return <>{fallback}</>;
};
