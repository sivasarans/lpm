import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: null,
    name: '',
    role: '',
    user_id: '',
    email: '',
    profile_picture: '',
    gender: '', // Added gender
    joining_date: '', // Added joining_date
    status: '', // Added status
    logged_user: null, // Variable to store the full user data
  },
  reducers: {
    setUser(state, action) {
      const userData = action.payload;
      // Set the full user data in logged_user
      state.logged_user = userData;

      // Update individual fields
      state.id = userData.id;
      state.name = userData.name;
      state.role = userData.role;
      state.user_id = userData.user_id;
      state.email = userData.email;
      state.profile_picture = userData.profile_picture;
      state.gender = userData.gender; // Set gender
      state.joining_date = userData.joining_date; // Set joining_date
      state.status = userData.status; // Set status
    },
    clearUser(state) {
      return {
        id: null,
        name: '',
        role: '',
        user_id: '',
        email: '',
        profile_picture: '',
        gender: '', // Clear gender
        joining_date: '', // Clear joining_date
        status: '', // Clear status
        logged_user: null, // Clear logged user data
      };
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
