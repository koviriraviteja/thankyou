import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { makeRedirectUri } from 'expo-auth-session';
import * as QueryParams from 'expo-auth-session/build/QueryParams';

// Required for web browser to close correctly on Expo Go
WebBrowser.maybeCompleteAuthSession();

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  login: (phoneNumber: string) => Promise<void>;
  verifyOtp: (phoneNumber: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial session load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      const redirectUrl = makeRedirectUri();
      console.log('EXACT REDIRECT URL GENERATED:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        if (result.type === 'success' && result.url) {
          console.log('Login successful via deep link, extracting session...');
          
          const { params, errorCode } = QueryParams.getQueryParams(result.url);
          
          if (errorCode) {
            console.error('OAuth Error:', errorCode);
          }

          const accessToken = params.access_token;
          const refreshToken = params.refresh_token;
          const code = params.code;

          console.log('Parsed token from URL:', !!accessToken);

          if (code) {
            const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) console.error('Code exchange error:', error);
            else console.log('Session extracted via code!');
          } else if (accessToken && refreshToken) {
            const { data: sessionData, error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
            if (error) console.error('Set session error:', error);
            else console.log('Session extracted via tokens!');
          }

          // Force a getSession to ensure context state updates
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            setSession(data.session);
            setUser(data.session.user);
          }

          router.replace('/(tabs)/');
        }
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      alert('Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phoneNumber: string) => {
    console.log(`Sending mock OTP to ${phoneNumber}`);
  };

  const verifyOtp = async (phoneNumber: string, otp: string) => {
    console.log(`Verifying mock OTP ${otp} for ${phoneNumber}`);
    if (otp === '123456') {
      // Stub user since we don't have a real phone auth backed by supabase yet
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, loginWithGoogle, login, verifyOtp, logout }}>
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
