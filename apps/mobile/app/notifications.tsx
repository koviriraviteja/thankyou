/**
 * ThankU — Notifications Screen
 *
 * Shows donation requests, approvals, ThankU notes, and system alerts.
 */

import React from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useNotification } from '../src/context/NotificationContext';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { spacing } from '../src/theme/spacing';
import { radius } from '../src/theme/radius';
import { EmptyState } from '../src/components/ui/EmptyState';

const NOTIFICATION_ICONS: Record<string, { icon: string; color: string; bg: string }> = {
  request: { icon: 'hand-left-outline', color: colors.primary, bg: colors.highlight },
  approved: { icon: 'checkmark-circle-outline', color: colors.success, bg: '#ECFDF5' },
  thanku: { icon: 'heart-outline', color: colors.coral, bg: '#FFF5F5' },
  system: { icon: 'information-circle-outline', color: colors.info, bg: '#EFF6FF' },
};

export default function NotificationsScreen() {
  const { notifications } = useNotification();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markAll}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            imageSource={require('../assets/images/empty-state.png')}
            title="All caught up!"
            body="You don't have any new notifications right now."
          />
        }
        renderItem={({ item }) => {
          const config = NOTIFICATION_ICONS[item.type] || NOTIFICATION_ICONS.system;
          return (
            <TouchableOpacity style={[styles.notifItem, !item.read && styles.notifUnread]}>
              <View style={[styles.notifIcon, { backgroundColor: config.bg }]}>
                <Ionicons name={config.icon as any} size={22} color={config.color} />
              </View>
              <View style={styles.notifContent}>
                <Text style={styles.notifTitle}>{item.title || 'Notification'}</Text>
                <Text style={styles.notifBody} numberOfLines={2}>{item.message || item.body}</Text>
                <Text style={styles.notifTime}>
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Just now'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.medium, paddingVertical: spacing.small,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  markAll: { ...typography.caption, color: colors.accent, fontWeight: '600' },
  list: { paddingVertical: spacing.tiny },
  notifItem: {
    flexDirection: 'row', padding: spacing.medium, backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  notifUnread: { backgroundColor: colors.highlight },
  notifIcon: {
    width: 44, height: 44, borderRadius: 22, justifyContent: 'center',
    alignItems: 'center', marginRight: spacing.small,
  },
  notifContent: { flex: 1 },
  notifTitle: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '700' },
  notifBody: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2, lineHeight: 20 },
  notifTime: { ...typography.caption, color: colors.textDisabled, marginTop: spacing.micro },
});
