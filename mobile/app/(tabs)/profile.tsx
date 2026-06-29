import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/context/AuthContext';

const MENU_ITEMS = [
  { id: '1', title: 'Personal Information', icon: 'person-outline' },
  { id: '2', title: 'My Favorites', icon: 'heart-outline' },
  { id: '3', title: 'Settings', icon: 'settings-outline' },
  { id: '4', title: 'Help & Support', icon: 'help-circle-outline' },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const displayName = user?.user_metadata?.full_name || 'Rahul Sharma';
  const email = user?.email || 'rahul@example.com';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <Ionicons name="settings-outline" size={24} color="#1C1C1E" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Info */}
        <View style={styles.profileInfoContainer}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: user?.user_metadata?.avatar_url || 'https://via.placeholder.com/150' }} 
              style={styles.avatar} 
            />
          </View>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#34C759' }]}>5</Text>
            <Text style={styles.statLabel}>Items Donated</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#0066FF' }]}>120</Text>
            <Text style={styles.statLabel}>Points Earned</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity key={item.id} style={[styles.menuItem, index !== MENU_ITEMS.length - 1 && styles.menuItemBorder]}>
              <View style={styles.menuIconBox}>
                <Ionicons name={item.icon as any} size={20} color="#8E8E93" />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.menuItem} onPress={logout}>
            <View style={styles.menuIconBox}>
              <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            </View>
            <Text style={[styles.menuText, { color: '#FF3B30' }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Promo Footer */}
        <View style={styles.promoContainer}>
          <Image 
            source={require('../../assets/images/banner-illustration.png')} 
            style={styles.promoImage} 
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.promoBtn}>
            <LinearGradient
              colors={['#0066FF', '#34C759']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.promoBtnGradient}
            >
              <Text style={styles.promoBtnText}>Join the Movement</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  settingsBtn: {
    width: 40,
    alignItems: 'flex-end',
  },
  profileInfoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E5EA',
    marginBottom: 12,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#8E8E93',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  promoContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  promoImage: {
    width: 200,
    height: 150,
    marginBottom: 16,
  },
  promoBtn: {
    width: '100%',
  },
  promoBtnGradient: {
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
  },
  promoBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
