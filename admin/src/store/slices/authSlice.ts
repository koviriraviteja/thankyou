import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AdminRole = 
  | 'super_admin'
  | 'admin'
  | 'operations_manager'
  | 'finance_manager'
  | 'support_agent'
  | 'content_manager'
  | 'vendor_manager';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: AdminRole;
  permissions: string[];
}

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: {
    id: '1',
    name: 'Muktha Admin',
    email: 'admin@thanku.app',
    role: 'super_admin',
    permissions: ['*'],
  },
  isAuthenticated: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AdminUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
