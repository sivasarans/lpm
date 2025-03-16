// src/actions/userActions.js
import { FETCH_USERS_SUCCESS, FETCH_USERS_FAILURE } from '../constants/actionTypes';
import apiService from '../services/apiService';

export const fetchUsersSuccess = (users) => ({
  type: FETCH_USERS_SUCCESS,
  payload: { users },
});

export const fetchUsersFailure = (error) => ({
  type: FETCH_USERS_FAILURE,
  payload: { error },
});

export const fetchUsers = () => {
  return async (dispatch) => {
    try {
      const response = await apiService.get('/users'); // Replace with your API endpoint
      dispatch(fetchUsersSuccess(response.data));
    } catch (error) {
      dispatch(fetchUsersFailure(error.message));
    }
  };
};
