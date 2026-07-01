/**
 * ThankU — Onboarding Splash Screens
 * 4 full-screen slides + logo header
 * Last slide → "Get Started" → Phone Login
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../../src/components/ui/Button';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/context/AuthContext';
import { typography } from '../../src/theme/typography';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const { loginWithGoogle } = useAuth();

  const markSeenAndGo = async (path: string) => {
    await AsyncStorage.setItem('thanku_onboarding_seen', 'true');
    router.push(path as any);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      {/* Top Background Illustration / Graphic */}
      <View style={styles.topSection}>
        <Image
          source={require('../../assets/images/thankq_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Image
          source={require('../../assets/images/family_illustration.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* Bottom Content Container */}
      <View style={styles.bottomCard}>
        <Text style={styles.title}>
          What You Don't Need,{'\n'}Someone Else Does.
        </Text>
        
        <View style={styles.actions}>
          <Button
            title="Get Started"
            onPress={() => markSeenAndGo('/(auth)/phone')}
            fullWidth
            style={styles.getStartedBtn}
          />
          <TouchableOpacity style={styles.googleBtn} onPress={loginWithGoogle}>
            <Ionicons name="logo-google" size={20} color="#1C1C1E" />
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => markSeenAndGo('/(tabs)')} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#E0F2F1', // Light Teal background for the top half to blend with images
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    width: '100%',
    position: 'relative',
  },
  logo: {
    width: 180,
    height: 90,
    marginTop: 20,
    zIndex: 10,
  },
  illustration: {
    width: width,
    height: 350,
    position: 'absolute',
    bottom: -120, // push it down significantly to account for transparent space in the image
    transform: [{ scale: 1.1 }],
  },
  bottomCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 32,
    paddingTop: 48,
    paddingBottom: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    ...typography.h2,
    color: '#1C1C1E',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 40,
  },
  actions: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  getStartedBtn: {
    marginBottom: 0,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    width: '100%',
    borderRadius: 999, // to match the primary button
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  googleBtnText: {
    ...typography.label,
    color: '#1C1C1E',
  },
  skipBtn: {
    paddingVertical: 12,
  },
  skipText: {
    ...typography.label,
    color: '#6E6E6E',
  },
});

