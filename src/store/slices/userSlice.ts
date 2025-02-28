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
// interface UserUpdate{
//   user_id: number;
//   password: string;
//   email: string;
//   full_name: string;
//   phone_number?: string;
//   profile_image?: string;
//   role: string;
// }

interface Statistics {
  totalStudents: number;
  graduatingStudents: number;
  ageDistribution: { age: number; count: number }[];
  newStudentsData: { month: string; count: number }[];
  sourceDistribution: { source: string; count: number }[];
}

interface UserState {
  users: User[];
  students: User[];
  statistics: Statistics | null;
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

// Function to handle errors properly
const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "response" in error) {
    return (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Unexpected error";
  }
  return "An unknown error occurred";
};

// API: Lấy danh sách tất cả người dùng
export const fetchUsers = createAsyncThunk("user/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await userServices.getAllUsers();
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(handleError(error));
  }
});

// API: Lấy thông tin người dùng theo ID
export const fetchUserById = createAsyncThunk("user/fetchUserById", async (userId: number, { rejectWithValue }) => {
  try {
    const response = await userServices.getUserById(userId);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(handleError(error));
  }
});

// API: Cập nhật thông tin người dùng
// export const updateUser = createAsyncThunk(
//   "user/updateUser",
//   async ({ userId, userData }: { userId: number; userData: Partial<User> }, { rejectWithValue }) => {
//     try {
//       const response = await userServices.updateUser(userId, userData);
//       return response.data;
//     } catch (error: unknown) {
//       return rejectWithValue(handleError(error));
//     }
//   }
// );

// API: Xóa người dùng
export const deleteUser = createAsyncThunk("user/deleteUser", async (userId: number, { rejectWithValue }) => {
  try {
    await userServices.deleteUser(userId);
    return userId;
  } catch (error: unknown) {
    return rejectWithValue(handleError(error));
  }
});

// API: Lấy danh sách học viên
export const fetchStudents = createAsyncThunk("user/fetchStudents", async (_, { rejectWithValue }) => {
  try {
    const response = await userServices.fetchStudents();
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(handleError(error));
  }
});

// API: Lấy thống kê học viên
export const fetchUserStatistics = createAsyncThunk("user/fetchUserStatistics", async (_, { rejectWithValue }) => {
  try {
    const token = userLocalStorage.get()?.token;
    if (!token) throw new Error("Không có token, vui lòng đăng nhập!");
    const response = await userServices.getUserStatistics(token);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(handleError(error));
  }
});

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

      // .addCase(updateUser.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
      //   state.loading = false;
      //   state.users = state.users.map((user) =>
      //     user.user_id === action.payload.user_id ? action.payload : user
      //   );
      // })
      // .addCase(updateUser.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string;
      // })

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

      .addCase(fetchUserStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStatistics.fulfilled, (state, action: PayloadAction<Statistics>) => {
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
