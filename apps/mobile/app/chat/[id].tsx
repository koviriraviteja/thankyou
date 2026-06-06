import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#002f34',
  secondary: '#00a49f',
  bg: '#f8f9fa',
  white: '#ffffff',
  textLight: '#406367',
  border: '#d8dfe0',
  messageSent: '#e1ffd4',
  messageReceived: '#ffffff',
};

// Mock Initial Messages
const INITIAL_MESSAGES = [
  { id: '1', text: 'Hi, is this still available?', sender: 'them', time: '10:42 AM' },
  { id: '2', text: 'Yes, it is.', sender: 'me', time: '10:44 AM' },
  { id: '3', text: 'Is the price negotiable?', sender: 'them', time: '10:45 AM' },
];

export default function ChatRoomScreen() {
  const { id, productTitle, otherUser, productImage } = useLocalSearchParams();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // In a real app, connect to socket.io and Supabase here
    // const socket = io('http://localhost:3003');
    // socket.emit('join_room', id);
    // socket.on('receive_message', (msg) => setMessages(prev => [...prev, msg]));
  }, [id]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    
    // Simulate typing indicator and response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Let me think about it.',
        sender: 'them',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2000);
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
            const isMe = item.sender === 'me';
            return (
              <View style={[styles.messageBubble, isMe ? styles.messageMe : styles.messageThem]}>
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.messageTime}>{item.time}</Text>
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
