import axios from "axios";

export const authServices = {
  login: async (credentials: { email: string; password: string }) => {
    return axios.post("/auth/login", credentials);
  },
};
