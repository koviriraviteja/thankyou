import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { useTheme } from '../src/context/ThemeContext';
import { typography } from '../src/theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeSplashScreen() {
  const { user, isLoading } = useAuth();
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Only proceed once auth state is resolved
    if (isLoading) return;

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Navigate to Home Feed after 2.5 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 2500);

    return () => clearTimeout(timer);
  }, [isLoading, fadeAnim]);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Ionicons name="heart" size={60} color={colors.primary} />
      </View>
    );
  }

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'Neighbor';
  const greeting = user 
    ? `Welcome back, ${userName}! 👋`
    : 'Welcome to ThankU!\nReady to spread kindness? 💛';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <View style={[styles.iconContainer, { backgroundColor: colors.highlight }]}>
          <Ionicons name="heart" size={64} color={colors.primary} />
        </View>
        <Text style={[styles.greeting, { color: colors.textPrimary }]}>
          {greeting}
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    ...typography.h2,
    textAlign: 'center',
    lineHeight: 36,
  },
});
