import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '../src/lib/supabase';
import { useAuth } from '../src/context/AuthContext';
import { useNotification } from '../src/context/NotificationContext';

const COLORS = {
  primary: '#059669', // Emerald Green
  secondary: '#10B981', // Emerald Light
  bg: '#f8f9fa',
  white: '#ffffff',
  textLight: '#4B5563', // Gray 600
  border: '#E5E7EB',
};

export default function NotificationsScreen() {
  const { user } = useAuth();
  const { clearBadge, notifications, removeNotification } = useNotification();

  useEffect(() => {
    // Clear the unread badge when entering the notifications screen
    clearBadge();
  }, [user]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.notificationCard}
      onPress={() => {
        removeNotification(item.id);
        router.push(`/chat/${item.chat_id}`);
      }}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="chatbubble-ellipses" size={24} color={COLORS.primary} />
      </View>
      <View style={styles.details}>
        <Text style={styles.title}>New Message regarding {item.productTitle}</Text>
        <Text style={styles.messageText} numberOfLines={2}>{item.text}</Text>
        <Text style={styles.time}>{new Date(item.created_at).toLocaleString()}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="notifications-off-outline" size={60} color={COLORS.border} />
            <Text style={styles.emptyText}>No new notifications</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: 16, 
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  backBtn: { padding: 4 },
  listContent: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 16, fontSize: 16, color: COLORS.textLight },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  details: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 6,
  },
  time: {
    fontSize: 11,
    color: '#9CA3AF',
  }
});
