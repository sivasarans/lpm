interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
  }
  
  interface User {
    username: string;
    role: string;
  }
  
  const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
  };
  
  type AuthAction = { type: 'LOGIN_SUCCESS'; payload: { user: User } } | { type: 'LOGOUT' };
  
  const authReducer = (state = initialState, action: AuthAction): AuthState => {
    switch (action.type) {
      case 'LOGIN_SUCCESS':
        return {
          ...state,
          isAuthenticated: true,
          user: action.payload.user,
        };
      case 'LOGOUT':
        return {
          ...state,
          isAuthenticated: false,
          user: null,
        };
      default:
        return state;
    }
  };
  
  export default authReducer;
  