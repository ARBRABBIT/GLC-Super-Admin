import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { UserRole } from '../types';

interface User {
  id: number;
  login_id: string;
  first_name: string;
  last_name: string;
  role_id: UserRole;
  role: string;
  is_first_login: number;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const getCleanStorageItem = (key: string): string | null => {
  const item = localStorage.getItem(key);
  return item && item !== 'undefined' && item !== 'null' ? item : null;
};

const getStoredUser = (): User | null => {
  const raw = getCleanStorageItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

const initialAccessToken = getCleanStorageItem('accessToken');
const initialRefreshToken = getCleanStorageItem('refreshToken');

const initialState: AuthState = {
  user: getStoredUser(),
  accessToken: initialAccessToken,
  refreshToken: initialRefreshToken,
  isAuthenticated: !!initialAccessToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken?: string }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken || null;
      state.refreshToken = refreshToken || null;
      state.isAuthenticated = !!accessToken;

      // Persist to localStorage safely
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      } else {
        localStorage.removeItem('accessToken');
      }

      if (refreshToken && refreshToken !== 'undefined' && refreshToken !== 'null') {
        localStorage.setItem('refreshToken', refreshToken);
      } else {
        localStorage.removeItem('refreshToken');
      }
    },
    logOut: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    updateTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken?: string }>) => {
      state.accessToken = action.payload.accessToken || null;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      
      if (action.payload.accessToken) {
        localStorage.setItem('accessToken', action.payload.accessToken);
      }
      if (action.payload.refreshToken && action.payload.refreshToken !== 'undefined' && action.payload.refreshToken !== 'null') {
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
    },
  },
});

export const { setCredentials, logOut, updateTokens } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
