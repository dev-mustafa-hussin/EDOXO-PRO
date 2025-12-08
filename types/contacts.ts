export interface ContactGroup {
  id: string;
  name: string;
  discountPercentage?: number;
  description?: string;
}

export type ContactType = "customer" | "supplier";

export interface Contact {
  id: string;
  type: ContactType;
  name: string;
  companyName?: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  taxNumber?: string;
  commercialRecord?: string;
  balance: number;
  groupId?: string;
  groupName?: string;
  status: "active" | "inactive";
  notes?: string;
  createdAt: string;
}

export interface Supplier extends Contact {
  type: "supplier";
  companyName?: string;
}

export interface Customer extends Contact {
  type: "customer";
  loyaltyPoints?: number;
}
