export interface Warehouse {
  id: string;
  name: string;
  location?: string;
  managerId?: string;
  phone?: string;
  status: "active" | "inactive";
}
