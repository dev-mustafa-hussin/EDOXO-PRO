import { create } from "zustand";
import { Contact, ContactType } from "@/types/contacts";

interface ContactState {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  getContactsByType: (type: ContactType) => Contact[];

  // Async Mock Actions
  fetchContacts: () => Promise<void>;
}

export const useContactStore = create<ContactState>((set, get) => ({
  contacts: [],
  isLoading: false,
  error: null,

  addContact: (contact) =>
    set((state) => ({ contacts: [...state.contacts, contact] })),

  updateContact: (id, updates) =>
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  deleteContact: (id) =>
    set((state) => ({
      contacts: state.contacts.filter((c) => c.id !== id),
    })),

  getContactsByType: (type) => {
    return get().contacts.filter((c) => c.type === type);
  },

  fetchContacts: async () => {
    set({ isLoading: true });
    // Simulate API call
    setTimeout(() => {
      set({ isLoading: false });
    }, 1000);
  },
}));
