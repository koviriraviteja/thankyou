import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';

const COLORS = {
  primary: '#059669',
  secondary: '#10B981',
  white: '#ffffff',
  text: '#059669',
  textLight: '#4B5563',
  border: '#d8dfe0',
};

export default function AuthGatewayScreen() {
  const { loginWithGoogle } = useAuth();

  const handlePhoneLogin = () => {
    router.push('/(auth)/phone');
  };

  const handleMockLogin = (provider: string) => {
    Alert.alert('Coming Soon', `${provider} login will be implemented soon! For now, please use Phone Login.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Mock Logo / Icon */}
        <View style={styles.logoPlaceholder}>
          <Ionicons name="heart" size={60} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>Welcome to GiveAway</Text>
        <Text style={styles.subtitle}>Help your community by sharing what you don't need.</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonOutline} onPress={handlePhoneLogin}>
          <Ionicons name="call-outline" size={24} color={COLORS.primary} style={styles.buttonIcon} />
          <Text style={styles.buttonTextDark}>Continue with Phone</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonOutline} onPress={loginWithGoogle}>
          <Ionicons name="logo-google" size={24} color={COLORS.primary} style={styles.buttonIcon} />
          <Text style={styles.buttonTextDark}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonOutline} onPress={() => handleMockLogin('Email')}>
          <Ionicons name="mail-outline" size={24} color={COLORS.primary} style={styles.buttonIcon} />
          <Text style={styles.buttonTextDark}>Continue with Email</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          If you continue, you are accepting Community{' '}
          <Text style={styles.linkText}>Terms and Conditions</Text> and{' '}
          <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  buttonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonIcon: {
    marginRight: 16,
  },
  buttonTextDark: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  footer: {
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    textDecorationLine: 'underline',
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

