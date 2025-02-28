import { https } from "@/services/config";

export const classServices = {
  getClassStatistics: (token: string, page: number, limit: number) =>
    https.get(`class/statistics?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};
