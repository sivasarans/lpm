import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchLeaveData = createAsyncThunk(
  'leave/fetchLeaveData',
  async (userId) => {
    const response = await axios.get('http://localhost:3700/leave');
    const leaveData = response.data.filter(item => item.user_id === userId);
    return leaveData.length ? leaveData[0] : {};
  }
);

export const fetchLeaveBalance = createAsyncThunk(
  'leave/fetchLeaveBalance',
  async (userId) => {
    const response = await axios.get('http://localhost:3700/');
    const LeaveBalance = response.data.filter(item => item.user_id === userId);
    return LeaveBalance.length ? LeaveBalance[0] : {};
  }
);

// Thunk to fetch leave data for all users
export const fetchLeaveData_all_users = createAsyncThunk(
  'leave/fetchLeaveData/allUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3700/leave');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to fetch leave data for all users
export const fetchLeaveBalance_all_users = createAsyncThunk(
  'leave/fetchLeaveBalance/allUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3700/leave/get-all-leave-balance/all-users/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// export const applyLeave = createAsyncThunk(
//   "leavestatus/applyLeave",
//   async (leaveRequest, { rejectWithValue }) => {
//     try {
//       const response = await axios.post('http://localhost:3700/leave/apply_leave', leaveRequest);
//       if (response.status === 200 || response.status === 201) {
//         // Reduce leave balance after applying leave
//         const reduceLeaveBalanceResponse = await axios.put('http://localhost:3700/leave/reduce_leave_balance', {
//           user_id: leaveRequest.user_id,
//           leave_type: leaveRequest.leave_type.toLowerCase(),
//           leave_days: leaveRequest.leave_days
//         });
//         return reduceLeaveBalanceResponse.data;
//       }
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

export const applyLeave = createAsyncThunk(
  "leavestatus/applyLeave",
  async (leaveRequest, { rejectWithValue }) => {
    try {
      console.log("🚀 Sending leave request:", leaveRequest);

      // Log all form data
      for (let [key, value] of leaveRequest.entries()) {
        console.log(`----------${key}: ${value}`);
      }

      const userSession = JSON.parse(sessionStorage.getItem("user")); // Retrieve user data
      console.log("User Session:", userSession); // Debugging
      
      const userToken = userSession?.token; // Extract token
      console.log("User Token:", userToken); // Debugging

      // if (!leaveRequest.get('leave_type')) {
      //   throw new Error("Leave type is required");
      // }
      // console.log("Dispatching applyLeave with leave_type:", leaveRequest.get('leave_type'));
      const response = await axios.post('http://localhost:3700/leave/apply_leave', leaveRequest, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`, // Send token for authentication
        },
      });
      // if (response.status === 200 || response.status === 201) {

      //   console.log( "temporary leave apply time, reduce leave balance is paused in store->reducers->leavestatus line 86")
      //   // Reduce leave balance after applying leave
      //   // const reduceLeaveBalanceResponse = await axios.put('http://localhost:3700/leave/reduce_leave_balance', {
      //   //   user_id: leaveRequest.get('user_id'),
      //   //   leave_type: leaveRequest.get('leave_type').toLowerCase(),
      //   //   leave_days: leaveRequest.get('leave_days')
      //   // });
      //   // return reduceLeaveBalanceResponse.data;

      //   console.log("✅ Leave applied successfully:", response.data);
      //   return response.data;
      // }
      if (response.status === 200 || response.status === 201) {
        console.log("✅ Leave applied successfully:", response.data);
        return response.data;
      } else {
        console.error("⚠️ Unexpected response:", response);
        return rejectWithValue("Unexpected response from server");
      }
      
    } catch (error) {
      console.error("🔥 Error in applyLeave thunk:", error);
      return rejectWithValue(error.response?.data || "Server error");
    }
  }
);

export const fetchLeaveRequests = createAsyncThunk(
  "leavestatus/fetchLeaveRequests",
  async () => {
    const response = await axios.get("http://localhost:3700/leave/get-all-status");
    console.log("siva: response", response);
    return response.data; // Extract and return only the data
  }
);

export const deleteLeaveRequests = createAsyncThunk("delete-leave-requests", async (requestId) => {
  console.log("Request ID:", requestId);

  const response = await axios.delete(`http://localhost:3700/leave/delete-leave-request/${requestId}`);
  return requestId; // Extract and return only the data
});

export const updateLeaveStatus = createAsyncThunk(
  "leavestatus/updateLeaveStatus",
  async ({ requestId, newStatus, remarks_1 = '',leave_days, leave_type, user_id, approved_by_name  }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:3700/leave/update-leave-status/${requestId}`,
        {
          status: newStatus,
          remarks: remarks_1,
          leave_days:leave_days,
          leave_type:leave_type,
          approved_by:approved_by_name,
          user_id:user_id,
        }
      );
      return { requestId, newStatus, remarks_1 };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

  
const leavestatusData = createSlice({ name: "leavestatus",initialState:{leavestatusData:[], loading:false, err:null,     leaveData: null,
  
  applied_leave:'',applyleave_success_message:"",applyleave_success_message_type:"",
  leaveData_all_users: null,
  leaveBalance_all_users: null,
  LeaveBalance: null,
  userData: JSON.parse(localStorage.getItem('userDetails')) || null, // Check localStorage initially

},
    reducers: {},
    extraReducers: (builder) => {builder

      .addCase(fetchLeaveData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeaveData.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveData = action.payload;
      })
      .addCase(fetchLeaveData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchLeaveBalance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeaveBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.LeaveBalance = action.payload;
      })
      .addCase(fetchLeaveBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchLeaveData_all_users.fulfilled, (state, action) => {
        state.leaveData_all_users = action.payload;
      })
      .addCase(fetchLeaveData_all_users.rejected, (state, action) => {
        state.leaveData_all_users = action.error.message;
      })
      .addCase(fetchLeaveBalance_all_users.fulfilled, (state, action) => {
        state.leaveBalance_all_users = action.payload;
      })
      .addCase(fetchLeaveBalance_all_users.rejected, (state, action) => {
        state.leaveBalance_all_users = action.error.message;
      })
        .addCase(fetchLeaveRequests.fulfilled, (state,action) => {
            state.leavestatusData = action.payload;
            state.loading = false;
        })
        .addCase(deleteLeaveRequests.fulfilled, (state, action) => {
          state.leavestatusData = state.leavestatusData.filter(
            (request) => request.id !== action.payload
          );})
        .addCase(updateLeaveStatus.fulfilled, (state, action) => {
          const { requestId, newStatus, remarks_1,approved_by_name } = action.payload;
          state.leavestatusData = state.leavestatusData.map((request) =>
            request.id === requestId
              ? { ...request, status: newStatus, remarks: remarks_1 , approved_by:approved_by_name }
              : request
          );
          state.loading = false;
        })
        .addCase(applyLeave.fulfilled, (state, action) => {
          state.applied_leave = action.payload;
          state.applyleave_success_message = "Leave applied successfully!";
          state.applyleave_success_message_type = "success";
          // Optionally, you can handle any updates in state if needed after applying leave
        })
        // .addDefaultCase((state) => {
        //   // Check if userData exists in localStorage and set it in Redux
        //   const storedUserData = JSON.parse(localStorage.getItem('userDetails'));
        //   if (storedUserData) {
        //     state.userData = storedUserData; // Automatically set user data from localStorage
        //   }
        // })
    }});

export default leavestatusData.reducer;