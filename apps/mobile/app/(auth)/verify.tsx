import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  primary: '#002f34',
  secondary: '#00a49f',
  white: '#ffffff',
  text: '#002f34',
  textLight: '#406367',
  border: '#d8dfe0',
  error: '#ff5a5f'
};

export default function VerifyScreen() {
  const { phone } = useLocalSearchParams();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { verifyOtp } = useAuth();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Focus input on mount
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, []);

  const handleVerify = async () => {
    if (otp.length < 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await verifyOtp(phone as string, otp);
      if (success) {
        // Dismiss the entire auth modal flow and go back to home feed
        router.replace('/');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Enter Confirmation Code</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code we sent to +91 {phone}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="000000"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={(text) => {
              setOtp(text.replace(/[^0-9]/g, ''));
              setError('');
            }}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity>
            <Text style={styles.resendLink}>Resend</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[
            styles.button, 
            otp.length < 6 && styles.buttonDisabled
          ]} 
          onPress={handleVerify}
          disabled={otp.length < 6 || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Verify and Create Account</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  inputContainer: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    paddingVertical: 8,
    marginBottom: 20,
  },
  input: {
    fontSize: 32,
    color: COLORS.primary,
    letterSpacing: 8,
    textAlign: 'center',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  resendText: {
    color: COLORS.textLight,
  },
  resendLink: {
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: COLORS.border,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
