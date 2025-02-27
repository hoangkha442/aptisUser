import { https } from "@/services/config";

export const userServices = {
    getAllUsers: () => https.get("user"),
  
    getUserById: (userId: number) => https.get(`user/${userId}`),
  
    updateUser: (userId: number, userData: any) => 
      https.patch(`user/${userId}`, userData),
  
    deleteUser: (userId: number) => 
      https.delete(`user/${userId}`),
  
    getUserStatistics: (token: string) => 
      https.get("user/statistics", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  
    fetchStudents: () => https.get("user/students"),
  };
  