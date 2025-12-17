import api from "@/lib/axios";

export const PermissionRequestService = {
  requestAccess: async (data: {
    requested_permission?: string;
    url: string;
    reason?: string;
  }) => {
    const response = await api.post("/permission-request", data);
    return response.data;
  },
};
