"use client";

import { ReactNode } from "react";
import { usePermission } from "@/hooks/use-permission";

interface PermissionGuardProps {
  children: ReactNode;
  permission: string;
  requireAll?: boolean; // if checking multiple, not implemented yet but good practice
  fallback?: ReactNode;
}

export const PermissionGuard = ({
  children,
  permission,
  fallback = null,
}: PermissionGuardProps) => {
  const { can, loading } = usePermission();

  if (loading) return null; // or a skeleton

  if (can(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
