import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch leave balance for a specific user
export const fetchLeaveBalance = createAsyncThunk(
  'leave/fetchLeaveBalance',
  async (userid) => {
    const response = await axios.get(`http://localhost:3700/leave_balance/${userid}`);
    return response.data;
  }
);

// Fetch leave balance for all users
export const fetchLeaveBalance_all_users = createAsyncThunk(
  'leave/fetchLeaveBalance/allUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3700/leave_balance_new');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const leaveSlice = createSlice({
  name: "leave",
  initialState: {
    leaveBalance_all_users: [],
    userLeaveBalance: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveBalance.fulfilled, (state, action) => {
        state.userLeaveBalance = action.payload;
      })
      .addCase(fetchLeaveBalance_all_users.fulfilled, (state, action) => {
        state.leaveBalance_all_users = action.payload;
      })
      .addCase(fetchLeaveBalance_all_users.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default leaveSlice.reducer;
