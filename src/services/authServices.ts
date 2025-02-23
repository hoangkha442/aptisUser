import { https } from "@/services/config";

export const authServices = {
  login: (credentials: { email: string; password: string }) => 
    https.post("auth/login", credentials),

  getUserInfo: (token: string) => 
    https.get("auth/get-info", {
      headers: { Authorization: `Bearer ${token}` },
    }),
};
