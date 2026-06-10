import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/context/AuthContext';

const COLORS = {
  primary: '#059669', // Emerald Green
  secondary: '#10B981', // Emerald Light
  bg: '#f8f9fa',
  white: '#ffffff',
  textLight: '#4B5563', // Gray 600
  border: '#E5E7EB',
  messageSent: '#D1FAE5', // Light Emerald
  messageReceived: '#ffffff',
};

export default function ChatRoomScreen() {
  const { id, productTitle, otherUser, productImage } = useLocalSearchParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (id) {
      fetchMessages();
      
      const subscription = supabase
        .channel(`public:messages:chat_id=eq.${id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${id}` }, (payload) => {
          console.log('New message received!', payload.new);
          setMessages((prev) => [...prev, payload.new]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [id]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', id)
      .order('created_at', { ascending: true });
    
    if (data) {
      setMessages(data);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || !user) return;

    const textToSend = inputText.trim();
    setInputText(''); // Optimistic clear

    const { error } = await supabase
      .from('messages')
      .insert({
        chat_id: id,
        sender_id: user.id,
        text: textToSend
      });

    if (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
      setInputText(textToSend); // Restore on error
    }
  };

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'ios') return;
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => setKeyboardHeight(e.endCoordinates.height));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: Platform.OS === 'android' ? keyboardHeight : 0 }]} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        enabled={Platform.OS === 'ios'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Image source={{ uri: productImage as string }} style={styles.headerImage} />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName} numberOfLines={1}>{otherUser}</Text>
            <Text style={styles.headerProduct} numberOfLines={1}>{productTitle}</Text>
          </View>
          <TouchableOpacity style={styles.backBtn}>
            <Ionicons name="ellipsis-vertical" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Chat Area */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            const isMe = item.sender_id === user?.id;
            const timeStr = new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <View style={[styles.messageBubble, isMe ? styles.messageMe : styles.messageThem]}>
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.messageTime}>{timeStr}</Text>
              </View>
            );
          }}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="add" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
          </View>
          {inputText.trim() ? (
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
              <Ionicons name="send" size={24} color={COLORS.secondary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.sendBtn}>
              <Ionicons name="mic" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  keyboardView: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { padding: 8 },
  headerImage: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 8 },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  headerProduct: { fontSize: 12, color: COLORS.textLight },
  chatList: { padding: 16 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 12, marginBottom: 12 },
  messageMe: { alignSelf: 'flex-end', backgroundColor: COLORS.messageSent, borderBottomRightRadius: 4 },
  messageThem: { alignSelf: 'flex-start', backgroundColor: COLORS.messageReceived, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: COLORS.border },
  messageText: { fontSize: 16, color: COLORS.primary, marginBottom: 4 },
  messageTime: { fontSize: 10, color: COLORS.textLight, alignSelf: 'flex-end' },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, paddingBottom: Platform.OS === 'ios' ? 24 : 20, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border, width: '100%' },
  attachBtn: { padding: 8, marginRight: 4, justifyContent: 'center' },
  textInputWrapper: { flex: 1, backgroundColor: COLORS.gray, borderRadius: 20, minHeight: 40, maxHeight: 100, justifyContent: 'center' },
  textInput: { paddingHorizontal: 16, paddingVertical: 10, fontSize: 16, color: COLORS.primary, width: '100%' },
  sendBtn: { padding: 8, marginLeft: 4, justifyContent: 'center' },
});
