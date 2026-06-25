import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { makeRedirectUri } from 'expo-auth-session';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import Constants from 'expo-constants';

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
    let browserOpen = false;
    try {
      // In Expo Go: generates exp://IP:PORT/--/auth/callback
      // In standalone build: generates thanku://auth/callback
      // Both must be registered in Supabase → Auth → URL Configuration → Redirect URLs
      const isExpoGo = Constants.appOwnership === 'expo';
      const redirectUrl = isExpoGo
        ? makeRedirectUri({ path: 'auth/callback' })
        : makeRedirectUri({ scheme: 'thanku', path: 'auth/callback' });

      console.log('Redirect URL:', redirectUrl);
      console.log('Running in:', isExpoGo ? 'Expo Go' : 'Standalone Build');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        browserOpen = true;
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        browserOpen = false;

        if (result.type === 'success' && result.url) {
          console.log('OAuth success, extracting session from:', result.url);

          const { params, errorCode } = QueryParams.getQueryParams(result.url);

          if (errorCode) {
            console.error('OAuth Error Code:', errorCode);
            alert(`Google Sign-In failed: ${errorCode}`);
            return;
          }

          const { code, access_token: accessToken, refresh_token: refreshToken } = params;

          if (code) {
            const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);
            if (codeError) throw codeError;
            console.log('Session extracted via PKCE code exchange!');
          } else if (accessToken && refreshToken) {
            const { error: tokenError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (tokenError) throw tokenError;
            console.log('Session extracted via implicit tokens!');
          } else {
            console.warn('No code or tokens found in redirect URL.');
            alert('Google Sign-In did not return valid credentials. Please try again.');
            return;
          }

          // Refresh context state
          const { data: freshSession } = await supabase.auth.getSession();
          if (freshSession.session) {
            setSession(freshSession.session);
            setUser(freshSession.session.user);
            router.dismissAll();
          }
        } else if (result.type === 'cancel' || result.type === 'dismiss') {
          // User closed the browser — this is expected, just do nothing
          console.log('Google Sign-In cancelled by user.');
        }
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      alert(error.message || 'Failed to sign in with Google. Please try again.');
    }
  };

  const login = async (phoneNumber: string) => {
    console.log(`Sending mock OTP to ${phoneNumber}`);
  };

  const verifyOtp = async (phoneNumber: string, otp: string) => {
    console.log(`Verifying mock OTP ${otp} for ${phoneNumber}`);
    if (otp === '123456') {
      // Create a mock user so the UI can render a logged-in state
      const mockUser = {
        id: 'mock-phone-user',
        aud: 'authenticated',
        role: 'authenticated',
        phone: phoneNumber,
        email: '',
        app_metadata: { provider: 'phone' },
        user_metadata: { full_name: 'Guest User' },
        created_at: new Date().toISOString(),
      } as any;
      
      setUser(mockUser);
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
