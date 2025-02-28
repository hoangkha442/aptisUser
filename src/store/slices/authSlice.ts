import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authServices } from "@/services/authServices";
import { userLocalStorage } from "@/services/LocalService";

interface User {
  role: string;
  token: string;
  email: string;
  full_name: string;
  phone_number: string;
  profile_image?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await authServices.login(credentials);
      userLocalStorage.set(res.data); // ✅ Lưu user vào localStorage
      return res.data;
    } catch (error: unknown) { // ✅ Changed `any` to `unknown`
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else if (typeof error === "object" && error !== null && "response" in error) {
        return rejectWithValue((error as { response?: { data?: { message?: string } } }).response?.data?.message || "Login failed");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
      userLocalStorage.remove();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
