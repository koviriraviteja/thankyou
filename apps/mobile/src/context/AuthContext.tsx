import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

type User = {
  id: string;
  phoneNumber: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (phoneNumber: string) => Promise<void>;
  verifyOtp: (phoneNumber: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'olx_auth_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved token on app start
    const loadSession = async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          // TODO: Validate token with backend and fetch user profile
          setUser({ id: 'stub-id', phoneNumber: 'stub-phone' });
        }
      } catch (error) {
        console.error('Failed to load session', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (phoneNumber: string) => {
    // Simulated API call to send OTP
    console.log(`Sending OTP to ${phoneNumber}`);
    // In real app: await axios.post('/api/auth/send-otp', { phoneNumber });
  };

  const verifyOtp = async (phoneNumber: string, otp: string) => {
    // Simulated API call to verify OTP
    console.log(`Verifying OTP ${otp} for ${phoneNumber}`);
    
    // In real app: const res = await axios.post('/api/auth/verify-otp', { phoneNumber, otp });
    // const token = res.data.token;
    
    // Simulate successful login
    if (otp === '123456') {
      const mockToken = 'mock-jwt-token';
      await SecureStore.setItemAsync(TOKEN_KEY, mockToken);
      setUser({ id: 'stub-id', phoneNumber });
      return true;
    }
    return false;
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setUser(null);
    router.replace('/');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
