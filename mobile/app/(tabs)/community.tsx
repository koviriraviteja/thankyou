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
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { shadows } from '../../src/theme/shadows';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Button } from '../../src/components/ui/Button';

type GratitudeFilter = 'All' | 'Received' | 'Given';
type HelpFilter = 'All' | 'Urgent' | 'Education' | 'Medical';
type ScreenMode = 'gratitude' | 'help';

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

const MOCK_REQUESTS = [
  {
    id: 'req1',
    userName: 'Ayesha Khan',
    date: 'Just now',
    urgency: 'High',
    request: 'Hi neighbors, my washing machine just broke down and I have a toddler. Does anyone know a cheap repair person or have a spare small washer?',
  },
  {
    id: 'req2',
    userName: 'Ravi Kumar',
    date: '2 hours ago',
    urgency: 'Medium',
    request: 'Looking for old 10th grade NCERT textbooks for my sister. We cannot afford new ones this year.',
  },
];

export default function CommunityScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  const [screenMode, setScreenMode] = useState<ScreenMode>('gratitude');
  const [activeTab, setActiveTab] = useState<GratitudeFilter>('All');
  const [requestTab, setRequestTab] = useState<HelpFilter>('All');

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

  const renderRequest = ({ item }: { item: typeof MOCK_REQUESTS[0] }) => (
    <View style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={18} color={colors.surface} />
        </View>
        <View style={styles.noteHeaderInfo}>
          <Text style={styles.noteSender}>{item.userName}</Text>
          <Text style={styles.noteDate}>{item.date}</Text>
        </View>
        <View style={[styles.urgencyBadge, item.urgency === 'High' && styles.urgencyHigh]}>
          <Text style={[styles.urgencyText, item.urgency === 'High' && styles.urgencyTextHigh]}>
            {item.urgency} Urgency
          </Text>
        </View>
      </View>
      <Text style={styles.noteMessage}>{item.request}</Text>
      
      <TouchableOpacity style={styles.helpBtn}>
        <Ionicons name="hand-right-outline" size={18} color={colors.surface} />
        <Text style={styles.helpBtnText}>Help Them</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Mode Toggle */}
      <View style={styles.header}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, screenMode === 'gratitude' && styles.toggleBtnActive]}
            onPress={() => setScreenMode('gratitude')}
          >
            <Text style={[styles.toggleText, screenMode === 'gratitude' && styles.toggleTextActive]}>
              🌟 Gratitude
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, screenMode === 'help' && styles.toggleBtnActive]}
            onPress={() => setScreenMode('help')}
          >
            <Text style={[styles.toggleText, screenMode === 'help' && styles.toggleTextActive]}>
              🤝 Help Board
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Segmented Sub-Tabs */}
      <View style={styles.tabContainer}>
        {screenMode === 'gratitude' ? (
          (['All', 'Received', 'Given'] as GratitudeFilter[]).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          (['All', 'Urgent', 'Education', 'Medical'] as HelpFilter[]).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, requestTab === tab && styles.tabActive]}
              onPress={() => setRequestTab(tab)}
            >
              <Text style={[styles.tabText, requestTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Notes / Requests Feed */}
      {screenMode === 'gratitude' ? (
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
      ) : (
        <FlatList
          data={MOCK_REQUESTS}
          keyExtractor={(item) => item.id}
          renderItem={renderRequest}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              imageSource={require('../../assets/images/empty-state.png')}
              title="No requests right now"
              body="Check back later to see if anyone in your neighborhood needs help."
            />
          }
          ListFooterComponent={
            <View style={styles.ctaContainer}>
              <Button
                title="Ask for Help"
                onPress={() => router.push('/create-request')}
                icon={<Ionicons name="megaphone-outline" size={20} color={colors.textOnPrimary} />}
              />
            </View>
          }
        />
      )}
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
    paddingVertical: spacing.small,
    backgroundColor: colors.surface,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radius.full,
    padding: 4,
    ...shadows.sm,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: spacing.small,
    alignItems: 'center',
    borderRadius: radius.full,
  },
  toggleBtnActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  toggleText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.primary,
    fontWeight: '700',
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

  // ─── Requests ────────────────────────────────────
  requestCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.medium,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    ...shadows.sm,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.small,
  },
  urgencyBadge: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  urgencyHigh: {
    backgroundColor: '#FEF2F2',
  },
  urgencyText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  urgencyTextHigh: {
    color: colors.error,
  },
  helpBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.small,
    borderRadius: radius.md,
    marginTop: spacing.small,
    gap: spacing.tiny,
  },
  helpBtnText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '700',
  },
});

