/**
 * ThankU — Chat Thread Screen
 *
 * Premium messaging with ThankU branding.
 * Features: Product context header, message bubbles, typing indicator.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  FlatList, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { shadows } from '../../src/theme/shadows';

export default function ChatScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { id, productTitle, otherUser, productImage } = useLocalSearchParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchMessages();
    const subscription = supabase
      .channel(`chat-${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${id}` },
        (payload) => setMessages((prev) => [...prev, payload.new])
      )
      .subscribe();
    return () => { supabase.removeChannel(subscription); };
  }, [id]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', id)
      .order('created_at', { ascending: true });
    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    const messageText = newMessage.trim();
    setNewMessage('');
    await supabase.from('messages').insert({
      chat_id: id,
      sender_id: user.id,
      text: messageText,
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = useCallback(({ item }: { item: any }) => {
    const isMe = item.sender_id === user?.id;
    return (
      <View style={[styles.messageBubbleRow, isMe ? styles.myRow : styles.theirRow]}>
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
          <Text style={[styles.messageText, isMe ? styles.myText : styles.theirText]}>
            {item.text}
          </Text>
          <Text style={[styles.timeText, isMe ? styles.myTime : styles.theirTime]}>
            {formatTime(item.created_at)}
          </Text>
        </View>
      </View>
    );
  }, [user?.id]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>{otherUser || 'User'}</Text>
          <Text style={styles.headerProduct} numberOfLines={1}>{productTitle || 'Item'}</Text>
        </View>
        {productImage && (
          <Image source={{ uri: productImage as string }} style={styles.headerImage} />
        )}
      </View>

      {/* Product Context Banner */}
      <TouchableOpacity style={styles.contextBanner}>
        <Ionicons name="gift-outline" size={16} color={colors.primary} />
        <Text style={styles.contextText} numberOfLines={1}>
          Discussing: {productTitle}
        </Text>
        <Ionicons name="chevron-forward" size={14} color={colors.textDisabled} />
      </TouchableOpacity>

      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <View style={styles.emptyChatIcon}>
                <Ionicons name="chatbubbles-outline" size={40} color={colors.secondary} />
              </View>
              <Text style={styles.emptyChatTitle}>Start the conversation</Text>
              <Text style={styles.emptyChatBody}>
                Be kind, be genuine. Great connections start with a friendly message.
              </Text>
            </View>
          }
        />

        {/* Input */}
        <View style={styles.inputBar}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={colors.textDisabled}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={1000}
            />
          </View>
          <TouchableOpacity
            style={[styles.sendBtn, !newMessage.trim() && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons name="send" size={20} color={newMessage.trim() ? colors.surface : colors.textDisabled} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ─── Header ──────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    marginRight: spacing.small,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  headerProduct: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.highlight,
    marginLeft: spacing.small,
  },

  // ─── Context Banner ──────────────────────────────
  contextBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.tiny,
    gap: spacing.tiny,
  },
  contextText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    flex: 1,
  },

  // ─── Messages ────────────────────────────────────
  messageList: {
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.medium,
  },
  messageBubbleRow: {
    marginBottom: spacing.tiny,
    maxWidth: '80%',
  },
  myRow: {
    alignSelf: 'flex-end',
  },
  theirRow: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    borderRadius: radius.lg,
  },
  myBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: radius.xs,
  },
  theirBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: radius.xs,
    ...shadows.sm,
  },
  messageText: {
    ...typography.body,
    lineHeight: 22,
  },
  myText: {
    color: colors.textOnPrimary,
  },
  theirText: {
    color: colors.textPrimary,
  },
  timeText: {
    ...typography.caption,
    fontSize: 10,
    marginTop: spacing.micro,
    alignSelf: 'flex-end',
  },
  myTime: {
    color: 'rgba(17,24,39,0.5)',
  },
  theirTime: {
    color: colors.textDisabled,
  },

  // ─── Empty ───────────────────────────────────────
  emptyChat: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  emptyChatIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  emptyChatTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.tiny,
  },
  emptyChatBody: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // ─── Input Bar ───────────────────────────────────
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.small,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.tiny,
  },
  inputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.medium,
    maxHeight: 120,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.small,
    minHeight: 44,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.border,
  },
});
