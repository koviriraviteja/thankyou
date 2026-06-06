import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#002f34',
  secondary: '#00a49f',
  white: '#ffffff',
  text: '#002f34',
  textLight: '#406367',
  border: '#d8dfe0',
};

export default function AuthGatewayScreen() {
  const handlePhoneLogin = () => {
    router.push('/(auth)/phone');
  };

  const handleMockLogin = (provider: string) => {
    Alert.alert('Coming Soon', `${provider} login will be implemented soon! For now, please use Phone Login.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Mock OLX Logo / Icon */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>O L X</Text>
        </View>
        <Text style={styles.title}>Welcome to OLX</Text>
        <Text style={styles.subtitle}>The trusted community of buyers and sellers.</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonOutline} onPress={handlePhoneLogin}>
          <Ionicons name="call-outline" size={24} color={COLORS.primary} style={styles.buttonIcon} />
          <Text style={styles.buttonTextDark}>Continue with Phone</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonOutline} onPress={() => handleMockLogin('Google')}>
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
          If you continue, you are accepting OLX{' '}
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
