import { combineReducers, configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import themeConfigSlice from './themeConfigSlice';
import userReducer from './reducers/userReducer';
import leavestatusData from './reducers/leavestatus';
import permissionsSlice from './reducers/permissionsSlice';

const rootReducer = combineReducers({
  themeConfig: themeConfigSlice,
  user: userReducer,
  leavestatus: leavestatusData, // Add the leavestatusData slice here. Adjust the path if necessary.
  permissions: permissionsSlice,

});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk),
});

export default store;

export type IRootState = ReturnType<typeof rootReducer>;
