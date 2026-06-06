import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#002f34',
  secondary: '#00a49f',
  bg: '#ffffff',
  gray: '#f2f4f5',
  textLight: '#406367',
  border: '#d8dfe0',
};

// Mock data for inbox
const MOCK_CHATS = [
  {
    id: 'chat_1',
    productId: '1',
    productTitle: 'iPhone 13 Pro Max - Mint Condition',
    productImage: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=150&q=80',
    otherUser: 'Rahul Sharma',
    lastMessage: 'Is the price negotiable?',
    time: '10:45 AM',
    unread: 2,
  },
  {
    id: 'chat_2',
    productId: '3',
    productTitle: 'Honda City V MT 2018 Petrol',
    productImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=150&q=80',
    otherUser: 'Priya Desai',
    lastMessage: 'I can come to see the car tomorrow.',
    time: 'Yesterday',
    unread: 0,
  }
];

export default function ChatsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <Ionicons name="filter-outline" size={24} color={COLORS.primary} />
      </View>

      <FlatList
        data={MOCK_CHATS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.chatRow}
            onPress={() => {
              router.push({
                pathname: '/chat/[id]',
                params: { 
                  id: item.id,
                  productTitle: item.productTitle,
                  otherUser: item.otherUser,
                  productImage: item.productImage,
                }
              });
            }}
          >
            <Image source={{ uri: item.productImage }} style={styles.productImage} />
            
            <View style={styles.chatDetails}>
              <View style={styles.rowTop}>
                <Text style={styles.otherUser} numberOfLines={1}>{item.otherUser}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.productTitle} numberOfLines={1}>{item.productTitle}</Text>
              
              <View style={styles.rowBottom}>
                <Text style={[styles.lastMessage, item.unread > 0 && styles.lastMessageUnread]} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
                {item.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
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
