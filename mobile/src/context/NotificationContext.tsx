import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NotificationContextType = {
  unreadBadge: boolean;
  clearBadge: () => void;
  notifications: any[];
  removeNotification: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextType>({
  unreadBadge: false,
  clearBadge: () => {},
  notifications: [],
  removeNotification: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [unreadBadge, setUnreadBadge] = useState(false);
  const [toastMessage, setToastMessage] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Load dismissed IDs and fetch initial notifications
  useEffect(() => {
    if (!user) return;
    
    const initNotifications = async () => {
      try {
        const stored = await AsyncStorage.getItem('dismissed_notifications');
        const dismissed = stored ? new Set<string>(JSON.parse(stored)) : new Set<string>();
        setDismissedIds(dismissed);

        // Fetch all chats
        const { data: chats } = await supabase
          .from('chats')
          .select('id, product:product_id(title)')
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);

        if (chats && chats.length > 0) {
          const chatIds = chats.map(c => c.id);
          
          // Fetch recent messages
          const { data: messages } = await supabase
            .from('messages')
            .select('*')
            .in('chat_id', chatIds)
            .neq('sender_id', user.id)
            .order('created_at', { ascending: false })
            .limit(30);

          if (messages) {
            const activeNotifications = messages
              .filter(msg => !dismissed.has(msg.id))
              .map(msg => {
                const chat = chats.find(c => c.id === msg.chat_id);
                return {
                  ...msg,
                  productTitle: (chat?.product as any)?.title || 'an item'
                };
              });
            setNotifications(activeNotifications);
          }
        }
      } catch (e) {
        console.error('Error fetching notifications:', e);
      }
    };

    initNotifications();
  }, [user]);

  const removeNotification = async (id: string) => {
    const newDismissed = new Set(dismissedIds);
    newDismissed.add(id);
    setDismissedIds(newDismissed);
    
    try {
      await AsyncStorage.setItem('dismissed_notifications', JSON.stringify([...newDismissed]));
    } catch (e) {
      console.error(e);
    }
    
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showToast = (messageData: any) => {
    setToastMessage(messageData);
    setUnreadBadge(true);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(4000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastMessage(null);
    });
  };

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          const newMessage = payload.new;
          
          // Ignore our own messages
          if (newMessage.sender_id === user.id) return;
          // Ignore if already dismissed (unlikely for new but safe)
          if (dismissedIds.has(newMessage.id)) return;

          // Check if this message belongs to a chat the user is part of
          const { data: chatData } = await supabase
            .from('chats')
            .select('buyer_id, seller_id, product_id, product:product_id(title)')
            .eq('id', newMessage.chat_id)
            .single();

          if (chatData && (chatData.buyer_id === user.id || chatData.seller_id === user.id)) {
            const productTitle = (chatData.product as any)?.title || 'an item';
            
            // Add to notifications list
            setNotifications(prev => [{ ...newMessage, productTitle }, ...prev]);

            // Show toast if we are not on the chat screen
            if (pathname !== `/chat/${newMessage.chat_id}`) {
              showToast({
                id: newMessage.id,
                chat_id: newMessage.chat_id,
                text: newMessage.text,
                productTitle: productTitle,
                sender_id: newMessage.sender_id
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, pathname, dismissedIds]);

  const clearBadge = () => setUnreadBadge(false);

  return (
    <NotificationContext.Provider value={{ unreadBadge, clearBadge, notifications, removeNotification }}>
      {children}
      {toastMessage && (
        <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={styles.toastContent}
            onPress={() => {
              clearBadge();
              removeNotification(toastMessage.id);
              setToastMessage(null);
              router.push(`/chat/${toastMessage.chat_id}`);
            }}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="chatbubble-ellipses" size={24} color="#ffffff" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.toastTitle}>New Message regarding {toastMessage.productTitle}</Text>
              <Text style={styles.toastText} numberOfLines={2}>{toastMessage.text}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#5ED6E3',
    borderRadius: 16,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 9999,
  },
  toastContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  toastTitle: {
    color: '#111827',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  toastText: {
    color: '#111827',
    fontSize: 13,
    opacity: 0.7,
  },
});
