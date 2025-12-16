import api from "@/lib/axios";

export const SettingService = {
  getSettings: async () => {
    const response = await api.get("/settings");
    return response.data;
  },

  updateSettings: async (settings: { [key: string]: any }) => {
    const response = await api.post("/settings", settings);
    return response.data;
  },
};
