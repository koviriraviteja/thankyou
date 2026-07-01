/**
 * ThankU — Initial Router
 * 
 * Flow:
 * - First time ever opening app → Onboarding splash screens
 * - Returning user (logged in) → Home directly
 * - Returning user (not logged in, already seen onboarding) → Phone login
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'thanku_onboarding_seen';

export default function RootIndex() {
  const { user, isLoading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) return;

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    const navigate = async () => {
      if (user) {
        // Already logged in → skip onboarding, go home
        router.replace('/(tabs)');
        return;
      }

      // Check if user has already seen onboarding before
      const seen = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (seen) {
        // Seen before → go straight to login
        router.replace('/(auth)/phone');
      } else {
        // First time → show onboarding splash
        router.replace('/(auth)/login');
      }
    };

    const timer = setTimeout(navigate, 1800);
    return () => clearTimeout(timer);
  }, [isLoading, user]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={require('../assets/images/thankq_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 220,
  },
});
