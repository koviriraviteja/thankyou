/**
 * ThankU — Messages / Chats Screen
 *
 * Premium chat list with ThankU design system.
 * Features: Unread indicators, product thumbnails, last message preview.
 */

import React, { useState, useCallback } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity, Image, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { EmptyState } from '../../src/components/ui/EmptyState';

export default function ChatsScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { user } = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchChats();
      } else {
        setChats([]);
        setLoading(false);
      }
    }, [user])
  );

  const fetchChats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('chats')
      .select('*, product:product_id(*)')
      .or(`buyer_id.eq.${user?.id},seller_id.eq.${user?.id}`)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const chatsWithMessages = await Promise.all(
        data.map(async (chat) => {
          const { data: msgData } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chat.id)
            .order('created_at', { ascending: false })
            .limit(1);
          const lastMessage = msgData?.[0] || null;
          const isUnread = lastMessage && lastMessage.sender_id !== user?.id;
          return { ...chat, lastMessage, isUnread };
        })
      );
      setChats(chatsWithMessages);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]} edges={['top']}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            imageSource={require('../../assets/images/empty-state.png')}
            title="No messages yet"
            body="When you message someone about an item, your conversations will appear here."
            ctaTitle="Browse Items"
            onCtaPress={() => router.push('/(tabs)/')}
          />
        }
        renderItem={({ item }) => {
          const isUserSeller = item.seller_id === user?.id;
          const otherUserDisplay = isUserSeller
            ? `Requester`
            : 'Donor';
          const timeAgo = getTimeAgo(item.lastMessage?.created_at || item.created_at);

          return (
            <TouchableOpacity
              style={[styles.chatRow, item.isUnread && styles.chatRowUnread]}
              onPress={() => {
                router.push({
                  pathname: '/chat/[id]',
                  params: {
                    id: item.id,
                    productTitle: item.product?.title || 'Item',
                    otherUser: otherUserDisplay,
                    productImage: item.product?.image_url,
                  },
                });
              }}
            >
              {/* Product Image */}
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: item.product?.image_url || 'https://via.placeholder.com/60' }}
                  style={styles.productImage}
                />
                {item.isUnread && <View style={styles.unreadDot} />}
              </View>

              {/* Chat Details */}
              <View style={styles.chatDetails}>
                <View style={styles.chatTopRow}>
                  <Text style={[styles.chatName, item.isUnread && styles.chatNameUnread]} numberOfLines={1}>
                    {otherUserDisplay}
                  </Text>
                  <Text style={styles.chatTime}>{timeAgo}</Text>
                </View>
                <Text style={styles.chatProduct} numberOfLines={1}>
                  {item.product?.title}
                </Text>
                <Text
                  style={[styles.chatMessage, item.isUnread && styles.chatMessageUnread]}
                  numberOfLines={1}
                >
                  {item.lastMessage?.text || 'Tap to start the conversation'}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={16} color={colors.textDisabled} />
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

function getTimeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString();
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ─── Header ──────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.medium,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },

  // ─── List ────────────────────────────────────────
  list: {
    paddingBottom: spacing.xxl,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.medium,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  chatRowUnread: {
    backgroundColor: colors.highlight,
  },

  // ─── Image ───────────────────────────────────────
  imageWrapper: {
    position: 'relative',
    marginRight: spacing.small,
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.highlight,
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surface,
  },

  // ─── Details ─────────────────────────────────────
  chatDetails: {
    flex: 1,
    marginRight: spacing.tiny,
  },
  chatTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  chatName: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  chatNameUnread: {
    fontWeight: '700',
  },
  chatTime: {
    ...typography.caption,
    color: colors.textDisabled,
    marginLeft: spacing.tiny,
  },
  chatProduct: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  chatMessage: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  chatMessageUnread: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
