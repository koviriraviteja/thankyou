/**
 * ThankU — Help Center Screen
 *
 * Matches Reference Image: Screen 22
 * Features: Search, FAQ categories, Report an Issue, chat with support.
 */

import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import { typography } from '../src/theme/typography';
import { spacing } from '../src/theme/spacing';
import { radius } from '../src/theme/radius';
import { shadows } from '../src/theme/shadows';

const FAQ_CATEGORIES = [
  { id: '1', title: 'Getting Started', subtitle: 'Learn how ThankU works', icon: 'rocket-outline' },
  { id: '2', title: 'Donating Items', subtitle: 'How to post and manage donations', icon: 'gift-outline' },
  { id: '3', title: 'Requesting Items', subtitle: 'How to find and request items', icon: 'hand-left-outline' },
  { id: '4', title: 'ThankU Donations', subtitle: 'About gratitude donations', icon: 'heart-outline' },
  { id: '5', title: 'Safety & Trust', subtitle: 'Guidelines and verification', icon: 'shield-checkmark-outline' },
  { id: '6', title: 'Account & Profile', subtitle: 'Manage your account', icon: 'person-outline' },
  { id: '7', title: 'Report an Issue', subtitle: 'Let us know if you need help', icon: 'flag-outline' },
];

export default function HelpCenterScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help Center</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>How can we help you?</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for help..."
              placeholderTextColor={colors.textDisabled}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* FAQ Categories */}
        <View style={styles.faqContainer}>
          {FAQ_CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.faqItem}>
              <View style={styles.faqIcon}>
                <Ionicons name={cat.icon as any} size={22} color={colors.primary} />
              </View>
              <View style={styles.faqInfo}>
                <Text style={styles.faqTitle}>{cat.title}</Text>
                <Text style={styles.faqSubtitle}>{cat.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textDisabled} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Support CTA */}
        <View style={styles.supportCard}>
          <View style={styles.supportContent}>
            <Text style={styles.supportTitle}>Still need help?</Text>
            <Text style={styles.supportSubtitle}>Chat with our support team</Text>
          </View>
          <TouchableOpacity style={styles.supportBtn}>
            <Ionicons name="chatbubbles" size={20} color={colors.surface} />
          </TouchableOpacity>
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
  subtitleContainer: { paddingHorizontal: spacing.medium, paddingTop: spacing.medium, backgroundColor: colors.surface },
  subtitle: { ...typography.h2, color: colors.textPrimary },
  searchContainer: {
    paddingHorizontal: spacing.medium, paddingVertical: spacing.medium, backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background,
    borderRadius: radius.md, paddingHorizontal: spacing.medium, paddingVertical: spacing.small,
    borderWidth: 1, borderColor: colors.border, gap: spacing.tiny,
  },
  searchInput: { flex: 1, ...typography.body, color: colors.textPrimary },
  faqContainer: {
    marginHorizontal: spacing.medium, marginTop: spacing.medium,
    backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden', ...shadows.sm,
  },
  faqItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.medium,
    paddingHorizontal: spacing.medium, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  faqIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.highlight,
    justifyContent: 'center', alignItems: 'center', marginRight: spacing.small,
  },
  faqInfo: { flex: 1 },
  faqTitle: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  faqSubtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },
  supportCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: spacing.medium, marginTop: spacing.medium,
    padding: spacing.medium, borderRadius: radius.lg, backgroundColor: colors.primary,
  },
  supportContent: { flex: 1 },
  supportTitle: { ...typography.body, color: colors.textOnPrimary, fontWeight: '700' },
  supportSubtitle: { ...typography.caption, color: colors.textOnPrimary, opacity: 0.8 },
  supportBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
});
