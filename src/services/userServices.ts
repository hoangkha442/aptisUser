import { https } from "@/services/config";

interface UserData {
  email: string;
  password: string; 
  full_name: string;
  phone_number?: string;
  role?: "admin" | "instructor" | "student";
  profile_image?: string;
}
export const userServices = {
  getAllUsers: () => https.get("user"),

  getUserById: (userId: number) => https.get(`user/${userId}`),

  updateUser: (userId: number, userData: UserData) =>
    https.patch(`user/${userId}`, userData),

  deleteUser: (userId: number) => https.delete(`user/${userId}`),

  getUserStatistics: (token: string) =>
    https.get("user/statistics", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  fetchStudents: () => https.get("user/students"),
};
