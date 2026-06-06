import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

const COLORS = {
  primary: '#002f34',
  secondary: '#00a49f',
  bg: '#f8f9fa',
  white: '#ffffff',
  textLight: '#406367',
  border: '#d8dfe0',
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color={COLORS.white} />
          </View>
          <View style={styles.info}>
            {user ? (
              <>
                <Text style={styles.name}>{user.name || 'OLX User'}</Text>
                <Text style={styles.sub}>+91 {user.phoneNumber}</Text>
                <TouchableOpacity style={styles.editProfileBtn}>
                  <Text style={styles.editProfileText}>View and edit profile</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.name}>Welcome to OLX!</Text>
                <Text style={styles.sub}>Take charge of your buying and selling journey.</Text>
                <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                  <Text style={styles.loginBtnText}>Log in or register</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
          {[
            { id: '1', title: 'Buy Packages & My Orders', icon: 'card-outline' },
            { id: '2', title: 'Settings', icon: 'settings-outline' },
            { id: '3', title: 'Help & Support', icon: 'help-circle-outline' },
            { id: '4', title: 'Select Language', icon: 'language-outline', value: 'English' },
          ].map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <Ionicons name={item.icon as any} size={24} color={COLORS.primary} style={styles.menuIcon} />
              <Text style={styles.menuText}>{item.title}</Text>
              {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
              <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          ))}

          {user && (
            <TouchableOpacity style={styles.logoutItem} onPress={logout}>
              <Ionicons name="log-out-outline" size={24} color={COLORS.primary} style={styles.menuIcon} />
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', padding: 24, backgroundColor: COLORS.white, alignItems: 'center', marginBottom: 8 },
  avatarContainer: { width: 70, height: 70, borderRadius: 35, backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 20 },
  info: { flex: 1 },
  name: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  sub: { fontSize: 14, color: COLORS.textLight, marginTop: 4, lineHeight: 20 },
  loginBtn: { marginTop: 12, backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 4, alignSelf: 'flex-start' },
  loginBtnText: { color: COLORS.white, fontWeight: 'bold' },
  editProfileBtn: { marginTop: 12 },
  editProfileText: { color: COLORS.primary, fontWeight: 'bold', textDecorationLine: 'underline' },
  menu: { backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border },
  menuItem: { flexDirection: 'row', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border, alignItems: 'center' },
  menuIcon: { marginRight: 16 },
  menuText: { fontSize: 16, color: COLORS.primary, flex: 1 },
  menuValue: { fontSize: 14, color: COLORS.textLight, marginRight: 8 },
  logoutItem: { flexDirection: 'row', padding: 20, alignItems: 'center' },
  logoutText: { fontSize: 16, color: COLORS.primary, fontWeight: 'bold' },
});
