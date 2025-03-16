import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import leavestatusData from './leavestatus';
import leaveReducer from "./leaveSlice";
import permissionsReducer from './permissionsSlice';


const store = configureStore({
  reducer: {
    user: userReducer,
    leavestatus: leavestatusData, // Add the leavestatusData slice here. Adjust the path if necessary.
    leave: leaveReducer,
    permissions: permissionsReducer,


  },
});

export default store;
