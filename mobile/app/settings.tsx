/**
 * ThankU — Settings Screen
 *
 * Matches Reference Image: Screen 23
 * Features: Profile link, Account Settings, Privacy, Notifications,
 * Payment, Language, Dark Mode toggle, About, Logout.
 */

import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { useTheme } from '../src/context/ThemeContext';
import { typography } from '../src/theme/typography';
import { spacing } from '../src/theme/spacing';
import { radius } from '../src/theme/radius';
import { shadows } from '../src/theme/shadows';

const SETTINGS_SECTIONS = [
  {
    title: 'Account',
    items: [
      { id: 'account', title: 'Account Settings', icon: 'person-outline', route: '/edit-profile' },
      { id: 'privacy', title: 'Privacy & Security', icon: 'lock-closed-outline', route: null },
      { id: 'notifications', title: 'Notifications', icon: 'notifications-outline', route: null },
      { id: 'payment', title: 'Payment Methods', icon: 'card-outline', route: null },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { id: 'address', title: 'Address Book', icon: 'location-outline', route: null },
      { id: 'language', title: 'Language', icon: 'language-outline', route: null, value: 'English' },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 'about', title: 'About ThankU', icon: 'information-circle-outline', route: null },
    ],
  },
];

export default function SettingsScreen() {
  const { colors, isDark, setTheme } = useTheme();
  const styles = getStyles(colors);
  const { user, logout } = useAuth();

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Profile Card */}
        <TouchableOpacity style={styles.profileCard} onPress={() => router.push('/edit-profile')}>
          <View style={styles.profileAvatar}>
            {user?.user_metadata?.avatar_url ? (
              <Image source={{ uri: user.user_metadata.avatar_url }} style={styles.profileAvatarImg} />
            ) : (
              <Ionicons name="person" size={24} color={colors.surface} />
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileSub}>View and edit profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
        </TouchableOpacity>

        {/* Settings Sections */}
        {SETTINGS_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.settingRow, i < section.items.length - 1 && styles.settingRowBorder]}
                  onPress={() => item.route && router.push(item.route as any)}
                >
                  <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                  <Text style={styles.settingText}>{item.title}</Text>
                  {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
                  <Ionicons name="chevron-forward" size={16} color={colors.textDisabled} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Dark Mode Toggle */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <View style={styles.settingRow}>
              <Ionicons name="moon-outline" size={20} color={colors.primary} />
              <Text style={styles.settingText}>Dark Mode</Text>
              <Switch
                value={isDark}
                onValueChange={(val) => setTheme(val ? 'dark' : 'light')}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
              />
            </View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>ThankU v1.0.0</Text>
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.medium, paddingVertical: spacing.small,
    backgroundColor: colors.surface,
  },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  profileCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, margin: spacing.medium,
    padding: spacing.medium, borderRadius: radius.lg, ...shadows.sm,
  },
  profileAvatar: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: colors.secondary,
    justifyContent: 'center', alignItems: 'center', marginRight: spacing.small,
  },
  profileAvatarImg: { width: 52, height: 52, borderRadius: 26 },
  profileInfo: { flex: 1 },
  profileName: { ...typography.body, color: colors.textPrimary, fontWeight: '700' },
  profileSub: { ...typography.caption, color: colors.textSecondary },
  section: { marginBottom: spacing.tiny },
  sectionTitle: {
    ...typography.caption, color: colors.textSecondary, fontWeight: '600',
    paddingHorizontal: spacing.medium, paddingVertical: spacing.tiny, textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionCard: {
    backgroundColor: colors.surface, marginHorizontal: spacing.medium,
    borderRadius: radius.lg, overflow: 'hidden', ...shadows.sm,
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.medium,
    paddingHorizontal: spacing.medium, gap: spacing.small,
  },
  settingRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  settingText: { ...typography.body, color: colors.textPrimary, flex: 1 },
  settingValue: { ...typography.bodySmall, color: colors.textSecondary, marginRight: spacing.tiny },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: spacing.medium, marginTop: spacing.medium,
    paddingVertical: spacing.medium, borderRadius: radius.lg,
    backgroundColor: colors.surface, gap: spacing.tiny, ...shadows.sm,
  },
  logoutText: { ...typography.body, color: colors.error, fontWeight: '600' },
  version: {
    ...typography.caption, color: colors.textDisabled, textAlign: 'center',
    marginTop: spacing.medium,
  },
});
