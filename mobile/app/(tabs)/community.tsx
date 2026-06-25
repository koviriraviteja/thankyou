/**
 * ThankU — Community Tab (Gratitude Wall)
 *
 * Matches Reference Image: Screen 19 (Reviews & Gratitude Wall)
 * Features: Segmented tabs (All, Received, Given), ThankU note cards,
 * "Write a ThankU Note" CTA.
 */

import React, { useState } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity, Image, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { shadows } from '../../src/theme/shadows';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Button } from '../../src/components/ui/Button';

type TabFilter = 'All' | 'Received' | 'Given';

// Mock data for gratitude notes
const MOCK_NOTES = [
  {
    id: '1',
    senderName: 'Priya Sharma',
    senderAvatar: null,
    date: 'May 12, 2025',
    message: 'Rahul is amazing! The chair is perfect and was just what I needed. Thank you so much! 💛',
    rating: 5,
    itemName: 'Wooden Chair',
    photos: [],
  },
  {
    id: '2',
    senderName: 'Anita Verma',
    senderAvatar: null,
    date: 'May 11, 2025',
    message: 'Thank you for the books! My kids are going to love reading them. 😊🙏',
    rating: 5,
    itemName: 'Children\'s Books Set',
    photos: [],
  },
  {
    id: '3',
    senderName: 'Karthik Ramesh',
    senderAvatar: null,
    date: 'May 10, 2025',
    message: 'Very kind person and easy to coordinate with. Highly recommended! 😊👍',
    rating: 5,
    itemName: 'Study Table',
    photos: [],
  },
];

export default function CommunityScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [activeTab, setActiveTab] = useState<TabFilter>('All');

  const renderNote = ({ item }: { item: typeof MOCK_NOTES[0] }) => (
    <View style={styles.noteCard}>
      {/* Header */}
      <View style={styles.noteHeader}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={18} color={colors.surface} />
        </View>
        <View style={styles.noteHeaderInfo}>
          <Text style={styles.noteSender}>{item.senderName}</Text>
          <Text style={styles.noteDate}>{item.date}</Text>
        </View>
        <View style={styles.ratingContainer}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Ionicons
              key={i}
              name={i < item.rating ? 'star' : 'star-outline'}
              size={14}
              color={colors.gold}
            />
          ))}
        </View>
      </View>

      {/* Message */}
      <Text style={styles.noteMessage}>{item.message}</Text>

      {/* Item Tag */}
      <View style={styles.itemTag}>
        <Ionicons name="gift-outline" size={14} color={colors.primary} />
        <Text style={styles.itemTagText}>{item.itemName}</Text>
      </View>

      {/* Actions */}
      <View style={styles.noteActions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="heart-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.actionText}>Applaud</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="share-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Gratitude Wall</Text>
          <Text style={styles.headerSubtitle}>Kind words from our community</Text>
        </View>
      </View>

      {/* Segmented Tabs */}
      <View style={styles.tabContainer}>
        {(['All', 'Received', 'Given'] as TabFilter[]).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notes Feed */}
      <FlatList
        data={MOCK_NOTES}
        keyExtractor={(item) => item.id}
        renderItem={renderNote}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            imageSource={require('../../assets/images/empty-state.png')}
            title="Waiting for your first note"
            body="When you give an item to a neighbor, they'll leave a ThankU note here. It's the best part of the app."
          />
        }
        ListFooterComponent={
          <View style={styles.ctaContainer}>
            <Button
              title="Write a ThankU Note"
              onPress={() => {}}
              icon={<Ionicons name="create-outline" size={20} color={colors.textOnPrimary} />}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.medium,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // ─── Tabs ────────────────────────────────────────
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.tiny,
  },
  tab: {
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.tiny,
    borderRadius: radius.full,
    backgroundColor: colors.background,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.textOnPrimary,
  },

  // ─── Notes ───────────────────────────────────────
  listContent: {
    padding: spacing.medium,
    gap: spacing.medium,
  },
  noteCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.medium,
    ...shadows.sm,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.small,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.small,
  },
  noteHeaderInfo: {
    flex: 1,
  },
  noteSender: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  noteDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 1,
  },
  noteMessage: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: spacing.small,
  },
  itemTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.micro,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: spacing.small,
  },
  itemTagText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  noteActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.small,
    gap: spacing.large,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  ctaContainer: {
    paddingVertical: spacing.large,
  },
});
