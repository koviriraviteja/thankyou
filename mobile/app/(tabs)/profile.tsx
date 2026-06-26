/**
 * ThankU — Profile & Trust Center Screen
 *
 * Matches Reference Image: Screen 15 (Trust & Verification)
 * Features: Trust Center checklist, Community Score, reviews,
 * impact summary, and navigation menu.
 */

import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { shadows } from '../../src/theme/shadows';
import { Button } from '../../src/components/ui/Button';

const VERIFICATION_ITEMS = [
  { id: '1', title: 'Phone Verified', icon: 'call-outline', status: 'verified' },
  { id: '2', title: 'Email Verified', icon: 'mail-outline', status: 'verified' },
  { id: '3', title: 'Identity Verified', icon: 'shield-checkmark-outline', status: 'verified' },
  { id: '4', title: 'Community Guidelines', icon: 'document-text-outline', status: 'completed' },
];

const MENU_ITEMS = [
  { id: '1', title: 'My Donation History', icon: 'heart-circle-outline', route: '/(tabs)/my-ads' },
  { id: '2', title: 'Impact Dashboard', icon: 'bar-chart-outline', route: '/impact' },
  { id: 'points', title: 'My Points & Limits', icon: 'star-outline', route: '/points' },
  { id: 'referral', title: 'Invite Friends', icon: 'people-outline', route: '/referral' },
  { id: '3', title: 'Leaderboard', icon: 'trophy-outline', route: '/leaderboard' },
  { id: '4', title: 'Settings', icon: 'settings-outline', route: '/settings' },
  { id: '5', title: 'Help & Support', icon: 'help-circle-outline', route: '/help-center' },
  { id: '6', title: 'Safety & Guidelines', icon: 'shield-outline', route: '/safety' },
];

export default function ProfileScreen() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  const { user, logout } = useAuth();

  const handleLogin = () => router.push('/(auth)/login');

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Background Watermark */}
        <Image 
          source={require('../../assets/logo.png')}
          style={[styles.watermark, { opacity: isDark ? 0.05 : 0.25 }]}
          pointerEvents="none"
        />

        <View style={styles.loginPrompt}>
          <View style={styles.loginIllustration}>
            <Ionicons name="person-circle-outline" size={80} color={colors.secondary} />
          </View>
          <Text style={styles.loginTitle}>Welcome to ThankU</Text>
          <Text style={styles.loginSubtitle}>
            Sign in to track your impact, manage donations, and connect with your community.
          </Text>
          <Button title="Sign In" onPress={handleLogin} />
          <TouchableOpacity onPress={handleLogin} style={{ marginTop: spacing.small }}>
            <Text style={styles.registerText}>Create a new account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Neighbor';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarSection}>
            {user.user_metadata?.avatar_url ? (
              <Image source={{ uri: user.user_metadata.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar}>
                <Ionicons name="person" size={36} color={colors.surface} />
              </View>
            )}
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={16} color={colors.surface} />
            </View>
          </View>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profileContact}>{user.email || user.phone || ''}</Text>
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => router.push('/edit-profile')}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Trust Center Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Verification</Text>
            <Ionicons name="shield-checkmark" size={20} color={colors.success} />
          </View>
          {VERIFICATION_ITEMS.map(item => (
            <View key={item.id} style={styles.verificationRow}>
              <View style={styles.verificationIcon}>
                <Ionicons name={item.icon as any} size={20} color={colors.primary} />
              </View>
              <Text style={styles.verificationText}>{item.title}</Text>
              <View style={[
                styles.statusBadge,
                item.status === 'completed' && styles.statusCompleted,
              ]}>
                <Text style={[
                  styles.statusText,
                  item.status === 'completed' && styles.statusTextCompleted,
                ]}>
                  {item.status === 'verified' ? 'Verified' : 'Completed'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Community Score Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Community Score</Text>
            <TouchableOpacity>
              <Text style={styles.howItWorks}>How it works?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.scoreContainer}>
            <View style={styles.scoreBig}>
              <Text style={styles.scoreNumber}>4.8</Text>
              <View style={styles.starsRow}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Ionicons key={i} name="star" size={14} color={colors.gold} />
                ))}
              </View>
            </View>
            <View style={styles.scoreMetrics}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>128</Text>
                <Text style={styles.metricLabel}>Items{'\n'}Donated</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>96%</Text>
                <Text style={styles.metricLabel}>Positive{'\n'}Feedback</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>142</Text>
                <Text style={styles.metricLabel}>People{'\n'}Helped</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => item.route && router.push(item.route as any)}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon as any} size={22} color={colors.primary} />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -150 },
      { translateY: -150 }
    ],
    width: 300,
    height: 300,
    resizeMode: 'contain',
    zIndex: -1,
  },

  // ─── Unauthenticated State ────────────────────────────────
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  loginIllustration: {
    marginBottom: spacing.large,
  },
  loginTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.tiny,
  },
  loginSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.large,
    lineHeight: 24,
  },
  registerText: {
    ...typography.bodySmall,
    color: colors.accent,
    fontWeight: '600',
  },

  // ─── Profile Header ─────────────────────────────
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.large,
    paddingHorizontal: spacing.medium,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarSection: {
    position: 'relative',
    marginBottom: spacing.small,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
  },
  profileName: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  profileContact: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  editProfileBtn: {
    marginTop: spacing.small,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.tiny,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editProfileText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },

  // ─── Section Cards ───────────────────────────────
  sectionCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.medium,
    marginTop: spacing.medium,
    borderRadius: radius.lg,
    padding: spacing.medium,
    ...shadows.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  howItWorks: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
  },

  // ─── Verification ────────────────────────────────
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  verificationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.small,
  },
  verificationText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.micro,
    borderRadius: radius.full,
    backgroundColor: colors.highlight,
  },
  statusCompleted: {
    backgroundColor: '#ECFDF5',
  },
  statusText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
    fontSize: 10,
  },
  statusTextCompleted: {
    color: colors.success,
  },

  // ─── Score ───────────────────────────────────────
  scoreContainer: {
    alignItems: 'center',
  },
  scoreBig: {
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  scoreNumber: {
    ...typography.display,
    color: colors.textPrimary,
    fontSize: 40,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
  },
  scoreMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around',
    paddingTop: spacing.medium,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '700',
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.divider,
  },

  // ─── Menu ────────────────────────────────────────
  menuSection: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.medium,
    marginTop: spacing.medium,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.small,
  },
  menuText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },

  // ─── Logout ──────────────────────────────────────
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.medium,
    marginTop: spacing.medium,
    paddingVertical: spacing.medium,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    gap: spacing.tiny,
    ...shadows.sm,
  },
  logoutText: {
    ...typography.body,
    color: colors.error,
    fontWeight: '600',
  },
});
