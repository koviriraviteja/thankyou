/**
 * ThankU — OTP Verification Screen
 *
 * Premium OTP entry with individual digit cells, resend timer, and ThankU branding.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { Button } from '../../src/components/ui/Button';

export default function VerifyScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { phone } = useLocalSearchParams();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const { verifyOtp } = useAuth();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 500);
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerify = async () => {
    if (otp.length < 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const success = await verifyOtp(phone as string, otp);
      if (success) {
        router.dismissAll();
      } else {
        setError('Invalid code. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    // Trigger resend logic here
  };

  // Display OTP as individual cells
  const otpDigits = otp.split('').concat(Array(6 - otp.length).fill(''));

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Enter verification code</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to{'\n'}
            <Text style={styles.phoneHighlight}>+91 {phone}</Text>
          </Text>
        </View>

        {/* OTP Cells */}
        <View style={styles.otpContainer}>
          {otpDigits.map((digit, i) => (
            <View
              key={i}
              style={[
                styles.otpCell,
                i < otp.length && styles.otpCellFilled,
                i === otp.length && styles.otpCellActive,
              ]}
            >
              <Text style={styles.otpDigit}>{digit}</Text>
            </View>
          ))}
          {/* Hidden input */}
          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={(text) => {
              setOtp(text.replace(/[^0-9]/g, ''));
              setError('');
            }}
            autoFocus
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Resend */}
        <View style={styles.resendContainer}>
          {resendTimer > 0 ? (
            <Text style={styles.resendTimer}>Resend code in {resendTimer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendLink}>Resend Code</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Button
            title="Verify & Continue"
            onPress={handleVerify}
            loading={isLoading}
            disabled={otp.length < 6 || isLoading}
          />
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
  },
  backBtn: {
    paddingVertical: spacing.small,
    alignSelf: 'flex-start',
  },
  header: {
    marginTop: spacing.large,
    marginBottom: spacing.xl,
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
  phoneHighlight: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },

  // ─── OTP Cells ───────────────────────────────────
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.tiny,
    marginBottom: spacing.medium,
    position: 'relative',
  },
  otpCell: {
    flex: 1,
    height: 60,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  otpCellFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  otpCellActive: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  otpDigit: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: 60,
    opacity: 0,
  },

  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.medium,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: spacing.large,
  },
  resendTimer: {
    ...typography.bodySmall,
    color: colors.textDisabled,
  },
  resendLink: {
    ...typography.bodySmall,
    color: colors.accent,
    fontWeight: '700',
  },
  ctaSection: {
    paddingBottom: spacing.large,
  },
});
