import React from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useNotification } from '../src/context/NotificationContext';
import { EmptyState } from '../src/components/ui/EmptyState';

const getNotificationIcons = (): Record<string, { icon: string; color: string; bg: string }> => ({
  request: { icon: 'hand-left-outline', color: '#0066FF', bg: '#E5F0FF' },
  approved: { icon: 'checkmark-circle-outline', color: '#34C759', bg: '#ECFDF5' },
  thanku: { icon: 'heart-outline', color: '#FF3B30', bg: '#FFF5F5' },
  system: { icon: 'information-circle-outline', color: '#8E8E93', bg: '#F5F5F5' },
});

export default function NotificationsScreen() {
  const { notifications } = useNotification();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.markAllBtn}>
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
          const config = getNotificationIcons()[item.type] || getNotificationIcons().system;
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
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  backBtn: { width: 40 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1C1C1E', flex: 1, textAlign: 'center' },
  markAllBtn: { width: 90, alignItems: 'flex-end' },
  markAll: { fontSize: 12, color: '#0066FF', fontWeight: '600' },
  list: { paddingVertical: 8 },
  notifItem: {
    flexDirection: 'row', padding: 16, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  notifUnread: { backgroundColor: '#F5F9FF' },
  notifIcon: {
    width: 44, height: 44, borderRadius: 22, justifyContent: 'center',
    alignItems: 'center', marginRight: 12,
  },
  notifContent: { flex: 1, justifyContent: 'center' },
  notifTitle: { fontSize: 14, color: '#1C1C1E', fontWeight: 'bold' },
  notifBody: { fontSize: 14, color: '#8E8E93', marginTop: 4, lineHeight: 20 },
  notifTime: { fontSize: 12, color: '#C7C7CC', marginTop: 4 },
});
