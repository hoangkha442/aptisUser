// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import { authServices } from "@/services/authServices";

// interface User {
//   role: string;
//   token: string;
//   email: string;
//   full_name: string;
//   phone_number: string;
//   profile_image?: string;
// }

// interface UserState {
//   user: User | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: UserState = {
//   user: null,
//   loading: false,
//   error: null,
// };

// export const getUserInfo = createAsyncThunk(
//   "user/getUserInfo",
//   async (token: string, { rejectWithValue }) => {
//     try {
//       const res = await authServices.getUserInfo({ token });
//       return res.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch user info");
//     }
//   }
// );

// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async (credentials: { email: string; password: string }, { rejectWithValue, dispatch }) => {
//     try {
//       const res = await authServices.login(credentials);
//       const userData = res.data;
//       dispatch(getUserInfo(userData.token)); 
//       return userData;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "Login failed");
//     }
//   }
// );

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     clearUser: (state) => {
//       state.user = null;
//       state.loading = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(getUserInfo.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getUserInfo.fulfilled, (state, action: PayloadAction<User>) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(getUserInfo.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearUser } = userSlice.actions;
// export default userSlice.reducer;
