/**
 * ThankU — Phone Login Screen
 *
 * Premium phone number entry with ThankU branding.
 */

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { Button } from '../../src/components/ui/Button';

export default function PhoneLoginScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleNext = async () => {
    if (phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await login(phoneNumber);
      router.push({ pathname: '/(auth)/verify', params: { phone: phoneNumber } });
    } catch {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Logo + Tagline */}
        <View style={styles.logoSection}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>నాకు అనవసరం... మీకు అవసరం.</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Sign in to ThankU</Text>
          <Text style={styles.subtitle}>
            We'll send a verification code to confirm it's you
          </Text>
        </View>

        {/* Referral Code — shared, applies to both Google and Phone */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Referral Code (Optional)</Text>
          <View style={[styles.inputContainer, { paddingHorizontal: spacing.medium }]}>
            <Ionicons name="ticket-outline" size={16} color={colors.textSecondary} style={{ marginRight: 4 }} />
            <TextInput
              style={styles.input}
              placeholder="Enter referral code"
              placeholderTextColor={colors.textDisabled}
              autoCapitalize="characters"
              value={referralCode}
              onChangeText={setReferralCode}
            />
          </View>
        </View>

        {/* Google Sign In */}
        <TouchableOpacity style={styles.googleBtn} onPress={() => router.push('/(tabs)')}>
          <Ionicons name="logo-google" size={20} color="#EA4335" />
          <Text style={styles.googleBtnText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Phone Input */}
        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <View style={styles.prefixBox}>
              <Text style={styles.flag}>🇮🇳</Text>
              <Text style={styles.prefix}>+91</Text>
              <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="00000 00000"
              placeholderTextColor={colors.textDisabled}
              keyboardType="phone-pad"
              maxLength={10}
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text.replace(/[^0-9]/g, ''));
                setError('');
              }}
              autoFocus
            />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Button
            title="Continue"
            onPress={handleNext}
            loading={isLoading}
            disabled={phoneNumber.length < 10 || isLoading}
          />
          <Text style={styles.disclaimer}>
            By continuing, you agree to receive an SMS for verification. Standard rates may apply.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.large,
    justifyContent: 'space-between',
  },
  backBtn: {
    paddingVertical: spacing.small,
    alignSelf: 'flex-start',
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: spacing.medium,
  },
  logo: {
    width: 80,
    height: 80,
  },
  tagline: {
    fontSize: 13,
    color: '#4BC6D3',
    fontWeight: '700',
    marginTop: 4,
  },
  header: {
    marginTop: spacing.small,
    marginBottom: spacing.medium,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.tiny,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.small,
    marginBottom: spacing.medium,
  },
  googleBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.large,
    gap: spacing.small,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  inputLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.tiny,
    fontWeight: '600',
  },
  inputSection: {
    marginBottom: spacing.large,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  prefixBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.medium,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    gap: spacing.micro,
  },
  flag: {
    fontSize: 20,
  },
  prefix: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.medium,
    ...typography.h3,
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    marginTop: spacing.tiny,
  },
  ctaSection: {
    paddingBottom: spacing.large,
  },
  disclaimer: {
    ...typography.caption,
    color: colors.textDisabled,
    textAlign: 'center',
    marginTop: spacing.small,
    lineHeight: 18,
  },
});
