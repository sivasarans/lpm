// src/constants/actionTypes.ts

export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

interface User {
  id: number;
  name: string;
  // Add other user properties as needed
}

interface FetchUsersSuccessAction {
  type: typeof FETCH_USERS_SUCCESS;
  payload: {
    users: User[];
  };
}

interface FetchUsersFailureAction {
  type: typeof FETCH_USERS_FAILURE;
  payload: {
    error: string;
  };
}

export type UserAction = FetchUsersSuccessAction | FetchUsersFailureAction;
