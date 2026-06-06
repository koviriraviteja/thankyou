import { Stack, router, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { useEffect } from 'react';

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    // Example guard: if they are trying to access the post (sell) screen but aren't logged in
    if (!user && segments[1] === 'post') {
      router.push('/(auth)/login');
    }
  }, [user, isLoading, segments]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="search" options={{ presentation: 'fullScreenModal', headerShown: false }} />
      <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="(auth)/phone" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="(auth)/verify" options={{ presentation: 'modal', headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
