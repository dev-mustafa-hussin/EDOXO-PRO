import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CompanySettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  taxNumber: string;
  logoUrl?: string;
  termsAndConditions?: string;
}

interface CompanyState {
  settings: CompanySettings;
  updateSettings: (settings: Partial<CompanySettings>) => void;
}

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set) => ({
      settings: {
        name: "EDOXO PRO",
        address: "القاهرة، مصر - شارع التسعين",
        phone: "+20 100 000 0000",
        email: "info@edoxo.pro",
        taxNumber: "300012345678903",
        termsAndConditions:
          "سياسة الاسترجاع: خلال 14 يوم عمل مع إحضار الفاتورة الأصلية. المنتجات يجب أن تكون بحالتها الأصلية.",
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: "company-settings", // unique name for localStorage
    }
  )
);
