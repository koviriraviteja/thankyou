/**
 * ThankU — Leaderboard Screen
 *
 * Matches Reference Image: Screen 17
 * Features: Tab segments (Top Donors, Most Helpful, Rising Stars),
 * ranked user list with avatars, donation counts, ratings.
 */

import React, { useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import { typography } from '../src/theme/typography';
import { spacing } from '../src/theme/spacing';
import { radius } from '../src/theme/radius';
import { shadows } from '../src/theme/shadows';

type LeaderboardTab = 'Top Donors' | 'Most Helpful' | 'Rising Stars';

const TABS: LeaderboardTab[] = ['Top Donors', 'Most Helpful', 'Rising Stars'];

const TOP_3 = [
  { rank: 2, name: 'Karthik R.', count: '156 Donations', avatar: null },
  { rank: 1, name: 'Priya Sharma', count: '214 Donations', avatar: null },
  { rank: 3, name: 'Anita Verma', count: '110 Donations', avatar: null },
];

const LEADERBOARD = [
  { rank: 4, name: 'Rahul Kumar', count: '88 Donations', rating: '4.7' },
  { rank: 5, name: 'Sneha Iyer', count: '76 Donations', rating: '4.7' },
  { rank: 6, name: 'Vikram N.', count: '64 Donations', rating: '4.5' },
  { rank: 7, name: 'Meera Nair', count: '58 Donations', rating: '4.5' },
  { rank: 8, name: 'Arjun Kumar', count: '52 Donations', rating: '4.3' },
  { rank: 9, name: 'Deepa M.', count: '48 Donations', rating: '4.2' },
  { rank: 10, name: 'Suresh P.', count: '45 Donations', rating: '4.1' },
];


export default function LeaderboardScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('Top Donors');
  const CROWN_COLORS = [colors.textDisabled, colors.gold, colors.textDisabled];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community Leaders</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.headerSub}>
        <Text style={styles.headerSubtext}>Celebrating our top contributors</Text>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabRow} contentContainerStyle={styles.tabRowContent}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top 3 Podium */}
        <View style={styles.podium}>
          {TOP_3.map((person, i) => {
            const isFirst = person.rank === 1;
            return (
              <View key={i} style={[styles.podiumItem, isFirst && styles.podiumItemFirst]}>
                <View style={[styles.podiumAvatar, isFirst && styles.podiumAvatarFirst]}>
                  <Ionicons name="person" size={isFirst ? 32 : 24} color={colors.surface} />
                  <View style={[styles.rankBadge, isFirst && styles.rankBadgeFirst]}>
                    <Text style={styles.rankBadgeText}>{person.rank}</Text>
                  </View>
                </View>
                <Text style={styles.podiumName} numberOfLines={1}>{person.name}</Text>
                <Text style={styles.podiumCount}>{person.count}</Text>
              </View>
            );
          })}
        </View>

        {/* Ranked List */}
        <View style={styles.listContainer}>
          {LEADERBOARD.map((person) => (
            <View key={person.rank} style={styles.listItem}>
              <Text style={styles.listRank}>{person.rank}</Text>
              <View style={styles.listAvatar}>
                <Ionicons name="person" size={18} color={colors.surface} />
              </View>
              <View style={styles.listInfo}>
                <Text style={styles.listName}>{person.name}</Text>
                <Text style={styles.listCount}>{person.count}</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color={colors.gold} />
                <Text style={styles.ratingText}>{person.rating}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Motivational Footer */}
        <View style={styles.footerCard}>
          <Text style={styles.footerEmoji}>🌟</Text>
          <Text style={styles.footerTitle}>Every act of kindness counts! 💚</Text>
          <Text style={styles.footerBody}>Keep giving, keep inspiring.</Text>
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.medium, paddingVertical: spacing.small, backgroundColor: colors.surface,
  },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  headerSub: { paddingHorizontal: spacing.medium, paddingBottom: spacing.small, backgroundColor: colors.surface },
  headerSubtext: { ...typography.bodySmall, color: colors.textSecondary },

  // ─── Tabs ────────────────────────────────────────
  tabRow: {
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
    maxHeight: 50,
  },
  tabRowContent: { paddingHorizontal: spacing.medium, gap: spacing.tiny, alignItems: 'center' },
  tab: {
    paddingHorizontal: spacing.medium, paddingVertical: spacing.small,
    borderRadius: radius.full, backgroundColor: colors.background,
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: colors.textOnPrimary },

  // ─── Podium ──────────────────────────────────────
  podium: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end',
    paddingVertical: spacing.xl, paddingHorizontal: spacing.medium, gap: spacing.small,
  },
  podiumItem: { alignItems: 'center', flex: 1 },
  podiumItemFirst: { marginTop: -20 },
  podiumAvatar: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: colors.secondary,
    justifyContent: 'center', alignItems: 'center', position: 'relative',
    borderWidth: 3, borderColor: colors.border,
  },
  podiumAvatarFirst: {
    width: 80, height: 80, borderRadius: 40, borderColor: colors.gold, borderWidth: 3,
  },
  rankBadge: {
    position: 'absolute', bottom: -6, width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.textSecondary, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: colors.surface,
  },
  rankBadgeFirst: { backgroundColor: colors.gold },
  rankBadgeText: { ...typography.caption, color: colors.surface, fontWeight: '800', fontSize: 10 },
  podiumName: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '700', marginTop: spacing.small },
  podiumCount: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },

  // ─── List ────────────────────────────────────────
  listContainer: {
    marginHorizontal: spacing.medium, backgroundColor: colors.surface,
    borderRadius: radius.lg, overflow: 'hidden', ...shadows.sm,
  },
  listItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.medium,
    paddingHorizontal: spacing.medium, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  listRank: { ...typography.body, color: colors.textSecondary, fontWeight: '700', width: 24 },
  listAvatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.secondary,
    justifyContent: 'center', alignItems: 'center', marginRight: spacing.small,
  },
  listInfo: { flex: 1 },
  listName: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  listCount: { ...typography.caption, color: colors.textSecondary },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    backgroundColor: colors.highlight, paddingHorizontal: spacing.tiny,
    paddingVertical: spacing.micro, borderRadius: radius.full,
  },
  ratingText: { ...typography.caption, color: colors.textPrimary, fontWeight: '700' },

  // ─── Footer ──────────────────────────────────────
  footerCard: {
    alignItems: 'center', marginHorizontal: spacing.medium, marginTop: spacing.large,
    padding: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.highlight,
  },
  footerEmoji: { fontSize: 32, marginBottom: spacing.tiny },
  footerTitle: { ...typography.h3, color: colors.textPrimary, textAlign: 'center' },
  footerBody: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: 2 },
});
