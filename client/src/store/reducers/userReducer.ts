// src/reducers/userReducer.ts
import { UserAction, FETCH_USERS_SUCCESS, FETCH_USERS_FAILURE } from '../constants/actionTypes';

interface UserState {
  users: User[];
  error: string | null;
}

interface User {
  id: number;
  name: string;
  // Add other user properties as needed
}

const initialState: UserState = {
  users: [],
  error: null,
};

const userReducer = (state: UserState = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload.users,
        error: null,
      };
    case FETCH_USERS_FAILURE:
      return {
        ...state,
        users: [],
        error: action.payload.error,
      };
    default:
      return state;
  }
};

export default userReducer;