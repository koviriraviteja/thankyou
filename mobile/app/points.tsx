import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/context/ThemeContext';
import { typography } from '../src/theme/typography';
import { spacing } from '../src/theme/spacing';
import { radius } from '../src/theme/radius';
import { shadows } from '../src/theme/shadows';

// Mock Data
const MOCK_POINTS = 450;
const MONTHLY_LIMIT = 1000;
const HISTORY = [
  { id: '1', title: 'Donated a Sofa', date: 'Oct 24', points: 50, type: 'earned' },
  { id: '2', title: 'Unlocked Premium Ad', date: 'Oct 20', points: -100, type: 'spent' },
  { id: '3', title: 'Verified Identity', date: 'Oct 15', points: 200, type: 'earned' },
  { id: '4', title: 'Referred a Friend', date: 'Oct 12', points: 300, type: 'earned' },
];

export default function PointsScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const progressPercentage = Math.min((MOCK_POINTS / MONTHLY_LIMIT) * 100, 100);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Points</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Balance & Limits Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Current Balance</Text>
          <View style={styles.balanceRow}>
            <Ionicons name="star" size={32} color={colors.gold} />
            <Text style={styles.balanceValue}>{MOCK_POINTS}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.limitHeader}>
            <Text style={styles.limitLabel}>Monthly Limit</Text>
            <Text style={styles.limitNumbers}>{MOCK_POINTS} / {MONTHLY_LIMIT}</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
          </View>
          <Text style={styles.limitFooter}>Resets on the 1st of next month</Text>
        </View>

        {/* Transaction History */}
        <Text style={styles.sectionTitle}>Transaction History</Text>
        
        <View style={styles.historyContainer}>
          {HISTORY.map((item, index) => {
            const isEarned = item.type === 'earned';
            return (
              <View 
                key={item.id} 
                style={[
                  styles.historyItem, 
                  index === HISTORY.length - 1 && styles.lastHistoryItem
                ]}
              >
                <View style={[styles.historyIcon, { backgroundColor: isEarned ? '#ECFDF5' : '#FEF2F2' }]}>
                  <Ionicons 
                    name={isEarned ? 'arrow-down' : 'arrow-up'} 
                    size={20} 
                    color={isEarned ? colors.success : colors.error} 
                  />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>{item.title}</Text>
                  <Text style={styles.historyDate}>{item.date}</Text>
                </View>
                <Text style={[
                  styles.historyPoints, 
                  { color: isEarned ? colors.success : colors.textPrimary }
                ]}>
                  {isEarned ? '+' : ''}{item.points}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.medium,
  },
  // ─── Header ──────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  // ─── Hero Card ──────────────────────────────────
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.large,
    alignItems: 'center',
    marginBottom: spacing.large,
    ...shadows.sm,
  },
  heroLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.tiny,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.small,
  },
  balanceValue: {
    ...typography.display,
    color: colors.textPrimary,
    fontSize: 48,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.large,
  },
  limitHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.small,
  },
  limitLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  limitNumbers: {
    ...typography.body,
    color: colors.textSecondary,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: spacing.small,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  limitFooter: {
    ...typography.caption,
    color: colors.textDisabled,
    width: '100%',
  },
  // ─── History Section ─────────────────────────────
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.medium,
    marginLeft: spacing.tiny,
  },
  historyContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.medium,
    ...shadows.sm,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  lastHistoryItem: {
    borderBottomWidth: 0,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.medium,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 2,
  },
  historyDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  historyPoints: {
    ...typography.h3,
    fontWeight: '700',
  },
});
