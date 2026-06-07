import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/context/AuthContext';

const COLORS = {
  primary: '#002f34',
  secondary: '#00a49f',
  bg: '#ffffff',
  gray: '#f2f4f5',
  textLight: '#406367',
  border: '#d8dfe0',
};

export default function ChatsScreen() {
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

    if (error) {
      console.error('Error fetching chats:', error);
    } else if (data) {
      // Fetch last message for each chat to determine unread status
      const chatsWithMessages = await Promise.all(data.map(async (chat) => {
        const { data: msgData } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chat.id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        const lastMessage = msgData && msgData.length > 0 ? msgData[0] : null;
        const isUnread = lastMessage && lastMessage.sender_id !== user?.id;
        
        return { ...chat, lastMessage, isUnread };
      }));
      setChats(chatsWithMessages);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <Ionicons name="filter-outline" size={24} color={COLORS.primary} />
      </View>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: COLORS.textLight }}>No active chats found.</Text>
          </View>
        }
        renderItem={({ item }) => {
          // Identify if the other person is the buyer or seller relative to the current user
          const isUserSeller = item.seller_id === user?.id;
          const otherUserId = isUserSeller ? item.buyer_id : item.seller_id;
          const otherUserDisplay = `User ${otherUserId.substring(0, 5)}...`; // We don't have joins for auth.users, so we abbreviate UUID

          return (
            <TouchableOpacity 
              style={styles.chatRow}
              onPress={() => {
                router.push({
                  pathname: '/chat/[id]',
                  params: { 
                    id: item.id,
                    productTitle: item.product?.title || 'Unknown Product',
                    otherUser: otherUserDisplay,
                    productImage: item.product?.image_url,
                  }
                });
              }}
            >
              <Image source={{ uri: item.product?.image_url || 'https://via.placeholder.com/60' }} style={styles.productImage} />
              
              <View style={styles.chatDetails}>
                <View style={styles.rowTop}>
                  <Text style={styles.otherUser} numberOfLines={1}>{otherUserDisplay}</Text>
                  <Text style={styles.time}>{new Date(item.created_at).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.productTitle} numberOfLines={1}>{item.product?.title}</Text>
                
                <View style={styles.rowBottom}>
                  <Text style={[styles.lastMessage, item.isUnread && styles.lastMessageUnread]} numberOfLines={1}>
                    {item.lastMessage ? item.lastMessage.text : 'Tap to view messages'}
                  </Text>
                  {item.isUnread && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}></Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  list: { paddingBottom: 20 },
  chatRow: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.gray, alignItems: 'center' },
  productImage: { width: 60, height: 60, borderRadius: 8, backgroundColor: COLORS.gray, marginRight: 16 },
  chatDetails: { flex: 1 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  otherUser: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, flex: 1 },
  time: { fontSize: 12, color: COLORS.textLight, marginLeft: 8 },
  productTitle: { fontSize: 12, color: COLORS.textLight, marginBottom: 4 },
  rowBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastMessage: { fontSize: 14, color: COLORS.textLight, flex: 1, paddingRight: 8 },
  lastMessageUnread: { color: COLORS.primary, fontWeight: 'bold' },
  unreadBadge: { backgroundColor: COLORS.secondary, borderRadius: 12, minWidth: 24, height: 24, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  unreadText: { color: COLORS.white, fontSize: 12, fontWeight: 'bold' },
});
