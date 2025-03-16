import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// Async Thunks
export const fetchUserData = createAsyncThunk('leave/fetchUserData', async () => {
  const userData = JSON.parse(localStorage.getItem('userDetails'));
  return userData || {};
});

export const fetchLeaveData = createAsyncThunk('leave/fetchLeaveData', async () => {
        const response = await axios.get('http://localhost:5000/leave');
  return response.data
});

export const applyLeave = createAsyncThunk('leave/applyLeave', async (leaveRequest) => {
  const response = await axios.post('http://localhost:5000/leave/apply_leave', leaveRequest);
  return response.data;
});

export const reduceLeaveBalance = createAsyncThunk('leave/reduceLeaveBalance', async (leaveBalance) => {
  const response = await axios.put('http://localhost:5000/leave/reduce_leave_balance', leaveBalance);
  return response.data;
});

// Initial state
const initialState = {
  userData: null,
  leaveData: {},
  leaveStatus: 'idle', // can be 'idle', 'loading', 'succeeded', 'failed'
  alertMessage: { message: '', type: '' }
};

// Slice
const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    resetLeaveForm(state) {
      state.leaveData = {};
      state.alertMessage = { message: '', type: '' };
    },
    setAlertMessage(state, action) {
      state.alertMessage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userData = action.payload;
      })
      .addCase(fetchLeaveData.fulfilled, (state, action) => {
        state.leaveData = action.payload;
      })
      .addCase(applyLeave.fulfilled, (state, action) => {
        state.alertMessage = { message: 'Leave applied successfully', type: 'success' };
      })
      .addCase(reduceLeaveBalance.fulfilled, (state, action) => {
        state.leaveData = { ...state.leaveData, ...action.payload };
      })
      .addCase(fetchLeaveData.rejected, (state) => {
        state.alertMessage = { message: 'Error fetching leave data', type: 'error' };
      })
      .addCase(applyLeave.rejected, (state) => {
        state.alertMessage = { message: 'Error applying leave', type: 'error' };
      });
  }
});

export const { resetLeaveForm, setAlertMessage } = leaveSlice.actions;

export default leaveSlice.reducer;
