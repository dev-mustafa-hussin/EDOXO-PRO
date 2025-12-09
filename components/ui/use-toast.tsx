"use client";

import * as React from "react";
import { toast as sonnerToast } from "sonner";

type ToasterToast = {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

function useToast() {
  const toast = React.useCallback(
    ({ title, description, variant, ...props }: ToasterToast) => {
      if (variant === "destructive") {
        return sonnerToast.error(title as string, {
          description: description as string,
          ...props,
        });
      }
      return sonnerToast(title as string, {
        description: description as string,
        ...props,
      });
    },
    []
  );

  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
}

export { useToast };
