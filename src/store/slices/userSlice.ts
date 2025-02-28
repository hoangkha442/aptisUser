import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { userServices } from "@/services/userServices";
import { userLocalStorage } from "@/services/LocalService";

interface User {
  user_id: number;
  email: string;
  full_name: string;
  phone_number?: string;
  profile_image?: string;
  role: string;
}

interface UserState {
  users: User[];
  students: User[];
  statistics: {
    totalStudents: number;
    graduatingStudents: number;
    ageDistribution: any[];
    newStudentsData: any[];
    sourceDistribution: any[];
  } | null;
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
    users: [],
    students: [],
    statistics: null,
    selectedUser: null,
    loading: false,
    error: null,
};

// API: Lấy danh sách tất cả người dùng
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userServices.getAllUsers();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Lỗi lấy danh sách người dùng");
    }
  }
);

// API: Lấy thông tin người dùng theo ID
export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await userServices.getUserById(userId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Lỗi lấy thông tin người dùng");
    }
  }
);

//  API: Cập nhật thông tin người dùng
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ userId, userData }: { userId: number; userData: Partial<User> }, { rejectWithValue }) => {
    try {
      const response = await userServices.updateUser(userId, userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Lỗi cập nhật người dùng");
    }
  }
);

// API: Xóa người dùng
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId: number, { rejectWithValue }) => {
    try {
      await userServices.deleteUser(userId);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Lỗi xóa người dùng");
    }
  }
);

// API: Lấy danh sách học viên
export const fetchStudents = createAsyncThunk(
  "user/fetchStudents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userServices.fetchStudents();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Lỗi lấy danh sách học viên");
    }
  }
);

export const fetchUserStatistics = createAsyncThunk(
    "user/fetchUserStatistics",
    async (_, { rejectWithValue }) => { 
      try {
        const token = userLocalStorage.get()?.token;
        if (!token) throw new Error("Không có token, vui lòng đăng nhập!");
        const response = await userServices.getUserStatistics(token)
       return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Lỗi lấy thống kê học viên");
      }
    }
  );
  
  

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch User by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users = state.users.map((user) =>
          user.user_id === action.payload.user_id ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.user_id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Students
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch User Statistics
      .addCase(fetchUserStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStatistics.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchUserStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetSelectedUser } = userSlice.actions;
export default userSlice.reducer;
