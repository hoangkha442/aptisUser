import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { classServices } from "@/services/classServices";
import { userLocalStorage } from "@/services/LocalService";

// Define Class Interface
export interface ClassData {
  class_id: number;
  class_name: string;
  max_students: number; 
  completed_sessions: number; 
  participation_rate: number; 
  homework_submission_rate: number; 
  start_date: string;
  end_date: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
}

// Define Class State Interface
interface ClassState {
  classList: ClassData[];
  pagination: Pagination | null;
  completedClasses: number | null;
  totalClasses: number | null;
  upcomingClosingClasses: number | null;
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: ClassState = {
  classList: [],
  pagination: null,
  completedClasses: null,
  totalClasses: null,
  upcomingClosingClasses: null,
  loading: false,
  error: null,
};

// Async Thunk for fetching class statistics
export const fetchClassStatistics = createAsyncThunk(
  "class/fetchClassStatistics",
  async (data: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const token = userLocalStorage.get()?.token;
      if (!token) throw new Error("Không có token, vui lòng đăng nhập!");

      const response = await classServices.getClassStatistics(token, data.page, data.limit);
      console.log("API Response: ", response.data);

      // Ensure API response fields are numbers
      return {
        classDetails: response.data.classDetails.map((cls: any) => ({
          class_id: Number(cls.class_id),
          class_name: cls.class_name,
          max_students: Number(cls.max_students) || 0,
          completed_sessions: Number(cls.completed_sessions) || 0,
          participation_rate: Number(cls.participation_rate) || 0,
          homework_submission_rate: Number(cls.homework_submission_rate) || 0,
          start_date: String(cls.start_date),
          end_date: String(cls.end_date),
        })),
        pagination: response.data.pagination,
        completedClasses: response.data.completedClasses,
        totalClasses: response.data.totalClasses,
        upcomingClosingClasses: response.data.upcomingClosingClasses,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi lấy thống kê lớp học"
      );
    }
  }
);

// Create Slice
const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {
    resetClassState: (state) => {
      state.classList = [];
      state.pagination = null;
      state.completedClasses = null;
      state.totalClasses = null;
      state.upcomingClosingClasses = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchClassStatistics.fulfilled,
        (
          state,
          action: PayloadAction<{
            classDetails: ClassData[];
            pagination: Pagination;
            completedClasses: number;
            totalClasses: number;
            upcomingClosingClasses: number;
          }>
        ) => {
          state.classList = action.payload.classDetails;
          state.pagination = action.payload.pagination;
          state.completedClasses = action.payload.completedClasses;
          state.totalClasses = action.payload.totalClasses;
          state.upcomingClosingClasses = action.payload.upcomingClosingClasses;
          state.loading = false;
        }
      )
      .addCase(fetchClassStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export Actions & Reducer
export const { resetClassState } = classSlice.actions;
export default classSlice.reducer;
