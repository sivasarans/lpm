import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch permission data
export const fetchPermissions = createAsyncThunk(
  'permissions/fetchPermissions',
  async () => {
    const response = await axios.get('http://localhost:5000/permission');
    return response.data.result; // Return raw data without filtering
  }
);

// Async thunk to update permission status
export const updatePermissionStatus = createAsyncThunk(
  'permissions/updatePermissionStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await axios.put(`http://localhost:5000/permission/update/${id}`, { status });
      return { id, status };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState: {
    permissionRequests: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchPermissions
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissionRequests = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Handle updatePermissionStatus
      .addCase(updatePermissionStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const index = state.permissionRequests.findIndex((req) => req.id === id);
        if (index !== -1) {
          state.permissionRequests[index].status = status;
        }
      })
      .addCase(updatePermissionStatus.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export default permissionsSlice.reducer;
