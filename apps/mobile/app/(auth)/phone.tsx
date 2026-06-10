import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  primary: '#059669',
  secondary: '#10B981',
  white: '#ffffff',
  text: '#059669',
  textLight: '#4B5563',
  border: '#d8dfe0',
  error: '#ff5a5f'
};

export default function PhoneLoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
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
      router.push({
        pathname: '/(auth)/verify',
        params: { phone: phoneNumber }
      });
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
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
          <Text style={styles.title}>Enter your phone number</Text>
          <Text style={styles.subtitle}>We will send a confirmation code to your phone</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.prefix}>+91</Text>
          <TextInput
            style={styles.input}
            placeholder="00000 00000"
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

        <TouchableOpacity 
          style={[styles.button, phoneNumber.length < 10 && styles.buttonDisabled]} 
          onPress={handleNext}
          disabled={phoneNumber.length < 10 || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Next</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { flex: 1, padding: 24, justifyContent: 'space-between' },
  header: { marginTop: 20, marginBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: COLORS.textLight },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: COLORS.primary, paddingVertical: 8, marginBottom: 20 },
  prefix: { fontSize: 18, color: COLORS.primary, fontWeight: 'bold', marginRight: 12 },
  input: { flex: 1, fontSize: 18, color: COLORS.primary },
  errorText: { color: COLORS.error, fontSize: 14, marginBottom: 20 },
  button: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  buttonDisabled: { backgroundColor: COLORS.border },
  buttonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});

