// src/actions/authActions.ts
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../reducers';
import { loginSuccess, logout } from '../../services/authService';

export const loginUser = (
  credentials: { username: string; password: string }
): ThunkAction<void, RootState, unknown, Action<string>> => {
  return async (dispatch) => {
    try {
      // Simulate API call for authentication
      const user = { username: credentials.username, role: 'user' };

      // Dispatch login success action
      dispatch(loginSuccess(user));
    } catch (error) {
      // Handle authentication error
      console.error('Authentication error:', error);
    }
  };
};

export const logoutUser = (): ThunkAction<void, RootState, unknown, Action<string>> => {
  return async (dispatch) => {
    try {
      // Simulate API call for logout
      // If needed, handle any cleanup logic here

      // Dispatch logout action
      dispatch(logout());
    } catch (error) {
      // Handle logout error
      console.error('Logout error:', error);
    }
  };
};
