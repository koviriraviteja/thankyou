/**
 * ThankU — Onboarding / Login Screen
 *
 * Matches Reference Image: Screen 20 (Onboarding Flow)
 * Premium welcome screen with ThankU branding, illustration placeholder,
 * "Give Freely. Help Genuinely." tagline, and auth options.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAuth } from '../../src/context/AuthContext';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { Button } from '../../src/components/ui/Button';

export default function OnboardingScreen() {
  const { loginWithGoogle } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip button */}
      <TouchableOpacity style={styles.skipBtn} onPress={() => router.replace('/(tabs)/')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        {/* Logo & Brand */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Ionicons name="heart" size={32} color={colors.surface} />
          </View>
          <Text style={styles.brandName}>ThankU</Text>
        </View>

        <Text style={styles.tagline}>Give Freely. Help Genuinely.</Text>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image 
            source={require('../../assets/images/onboarding-hero.png')} 
            style={{ width: 280, height: 280 }} 
            contentFit="contain" 
          />
        </View>
      </View>

      {/* Welcome Text */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Welcome to ThankU</Text>
        <Text style={styles.welcomeBody}>
          A community where giving creates{'\n'}happiness and gratitude grows.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <Button
          title="Get Started"
          onPress={() => router.push('/(auth)/phone')}
          size="lg"
          icon={<Ionicons name="arrow-forward" size={20} color={colors.textOnPrimary} />}
        />

        <TouchableOpacity style={styles.googleBtn} onPress={loginWithGoogle}>
          <Ionicons name="logo-google" size={20} color={colors.textPrimary} />
          <Text style={styles.googleBtnText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/phone')}>
          <Text style={styles.existingAccount}>I already have an account</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our{' '}
          <Text style={styles.linkText}>Terms</Text> and{' '}
          <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.large,
  },
  skipBtn: {
    alignSelf: 'flex-end',
    paddingVertical: spacing.tiny,
    paddingHorizontal: spacing.small,
  },
  skipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  // ─── Hero ────────────────────────────────────────
  heroSection: {
    alignItems: 'center',
    paddingTop: spacing.large,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.tiny,
    marginBottom: spacing.tiny,
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    ...typography.h1,
    color: colors.primary,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.large,
  },
  illustrationContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },


  // ─── Welcome ─────────────────────────────────────
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: spacing.large,
  },
  welcomeTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.tiny,
  },
  welcomeBody: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // ─── Actions ─────────────────────────────────────
  actionSection: {
    gap: spacing.small,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.tiny,
  },
  googleBtnText: {
    ...typography.label,
    color: colors.textPrimary,
  },
  existingAccount: {
    ...typography.bodySmall,
    color: colors.accent,
    textAlign: 'center',
    fontWeight: '600',
    paddingVertical: spacing.tiny,
  },

  // ─── Footer ──────────────────────────────────────
  footer: {
    marginTop: 'auto',
    paddingBottom: spacing.medium,
  },
  footerText: {
    ...typography.caption,
    color: colors.textDisabled,
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: colors.accent,
    fontWeight: '600',
  },
});
