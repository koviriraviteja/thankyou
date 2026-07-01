/**
 * ThankU — Impact Dashboard Screen
 *
 * Matches Reference Image: Screen 18
 * Features: Impact metrics cards, environmental stats,
 * monthly growth comparison, animated counters.
 */

import React from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useTheme } from '../src/context/ThemeContext';
import { typography } from '../src/theme/typography';
import { spacing } from '../src/theme/spacing';
import { radius } from '../src/theme/radius';
import { shadows } from '../src/theme/shadows';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getImpactMetrics = (colors: any) => [
  { value: '28', label: 'Items\nDonated', icon: 'gift', color: colors.primary },
  { value: '156', label: 'People\nHelped', icon: 'people', color: colors.coral },
  { value: '₹12,450', label: 'Money\nSaved', icon: 'cash', color: colors.success },
];

const ENV_METRICS = [
  { value: '2,450', label: 'Waste Reduced (kg)', icon: 'leaf' },
  { value: '12', label: 'Trees Saved', icon: 'flower' },
  { value: '320 kg', label: 'CO₂ Reduced', icon: 'earth' },
];

const MONTHLY_DATA = [
  { month: 'Jan', value: 5 },
  { month: 'Feb', value: 12 },
  { month: 'Mar', value: 8 },
  { month: 'Apr', value: 18 },
  { month: 'May', value: 25 },
  { month: 'Jun', value: 28 },
];

export default function ImpactScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const maxValue = Math.max(...MONTHLY_DATA.map(d => d.value));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Your Impact</Text>
          </View>
          <TouchableOpacity style={styles.periodDropdown}>
            <Text style={styles.periodToggle}>This Month</Text>
            <Ionicons name="chevron-down" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>You're changing lives! 🌍💛</Text>
        </View>

        {/* Main Metrics */}
        <View style={styles.metricsRow}>
          {getImpactMetrics(colors).map((metric, i) => (
            <View key={i} style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: `${metric.color}20` }]}>
                <Ionicons name={metric.icon as any} size={22} color={metric.color} />
              </View>
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricLabel}>{metric.label}</Text>
            </View>
          ))}
        </View>

        {/* Environmental Impact */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Environmental Impact</Text>
          <View style={styles.envRow}>
            {ENV_METRICS.map((metric, i) => (
              <View key={i} style={styles.envItem}>
                <View style={styles.envIcon}>
                  <Ionicons name={metric.icon as any} size={20} color={colors.success} />
                </View>
                <Text style={styles.envValue}>{metric.value}</Text>
                <Text style={styles.envLabel}>{metric.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Growth Chart */}
        <View style={styles.sectionCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>Impact Growth</Text>
            <View style={styles.growthBadge}>
              <Ionicons name="trending-up" size={14} color={colors.success} />
              <Text style={styles.growthText}>+36% vs last month</Text>
            </View>
          </View>
          <View style={styles.chart}>
            {MONTHLY_DATA.map((item, i) => {
              const barHeight = (item.value / maxValue) * 120;
              const isLast = i === MONTHLY_DATA.length - 1;
              return (
                <View key={i} style={styles.chartBar}>
                  <View
                    style={[
                      styles.bar,
                      { height: barHeight, backgroundColor: isLast ? colors.primary : colors.secondary },
                    ]}
                  />
                  <Text style={styles.chartLabel}>{item.month}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Motivational Footer */}
        <View style={styles.motivationCard}>
          <Image 
            source={require('../assets/images/impact-globe.png')} 
            style={{ width: 140, height: 140, marginBottom: spacing.medium }} 
            contentFit="contain" 
          />
          <Text style={styles.motivationText}>
            Keep going! Your kindness is inspiring 🌱
          </Text>
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
    borderBottomWidth: 1, borderBottomColor: colors.border,
    minHeight: 64,
  },
  headerBack: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  periodDropdown: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.highlight,
    paddingHorizontal: spacing.medium, paddingVertical: 8, borderRadius: radius.full, gap: 4,
  },
  periodToggle: { ...typography.caption, color: colors.primary, fontWeight: '700' },

  heroSection: {
    padding: spacing.large, backgroundColor: colors.surface,
  },
  heroTitle: { ...typography.h2, color: colors.textPrimary },

  // ─── Metrics ─────────────────────────────────────
  metricsRow: {
    flexDirection: 'row', paddingHorizontal: spacing.medium,
    paddingVertical: spacing.medium, gap: spacing.tiny,
  },
  metricCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.medium, alignItems: 'center', ...shadows.sm,
  },
  metricIcon: {
    width: 44, height: 44, borderRadius: 22, justifyContent: 'center',
    alignItems: 'center', marginBottom: spacing.tiny,
  },
  metricValue: {
    ...typography.h2, color: colors.textPrimary, fontWeight: '800', fontSize: 22,
  },
  metricLabel: {
    ...typography.caption, color: colors.textSecondary, textAlign: 'center', marginTop: 2,
  },

  // ─── Environmental ───────────────────────────────
  sectionCard: {
    backgroundColor: colors.surface, marginHorizontal: spacing.medium,
    marginTop: spacing.medium, borderRadius: radius.lg, padding: spacing.medium, ...shadows.sm,
  },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.medium },
  envRow: { flexDirection: 'row', justifyContent: 'space-around' },
  envItem: { alignItems: 'center', flex: 1 },
  envIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#ECFDF5',
    justifyContent: 'center', alignItems: 'center', marginBottom: spacing.tiny,
  },
  envValue: { ...typography.h3, color: colors.textPrimary, fontWeight: '700' },
  envLabel: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', marginTop: 2 },

  // ─── Chart ───────────────────────────────────────
  chartHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.medium,
  },
  growthBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5',
    paddingHorizontal: spacing.small, paddingVertical: spacing.micro, borderRadius: radius.full, gap: 4,
  },
  growthText: { ...typography.caption, color: colors.success, fontWeight: '700' },
  chart: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end',
    height: 150, paddingTop: spacing.large,
  },
  chartBar: { alignItems: 'center', flex: 1 },
  bar: { width: 24, borderRadius: radius.sm, minHeight: 8 },
  chartLabel: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.tiny },

  // ─── Motivation ──────────────────────────────────
  motivationCard: {
    marginHorizontal: spacing.medium, marginTop: spacing.medium,
    padding: spacing.large, borderRadius: radius.lg, backgroundColor: colors.highlight,
    alignItems: 'center',
  },
  motivationText: { ...typography.body, color: colors.textPrimary, fontWeight: '600', textAlign: 'center' },
});
