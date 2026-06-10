import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../src/lib/supabase';
import { useAuth } from '../src/context/AuthContext';

const COLORS = {
  primary: '#059669', // Emerald Green
  secondary: '#10B981', // Emerald Light
  bg: '#ffffff',
  gray: '#f2f4f5',
  textLight: '#4B5563', // Gray 600
  border: '#E5E7EB',
};

export default function EditAdScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (id) fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (data) {
      setTitle(data.title || '');
      setDescription(data.description || '');
      setLocation(data.location || '');
    }
    setIsFetching(false);
  };

  const handleUpdate = async () => {
    if (!title || !location) {
      Alert.alert('Error', 'Please fill all mandatory fields');
      return;
    }
    
    setIsLoading(true);

    try {
      const { error: dbError } = await supabase
        .from('products')
        .update({
          title,
          description,
          price: 'Free',
          location,
        })
        .eq('id', id);

      if (dbError) throw dbError;

      setIsLoading(false);
      Alert.alert('Success', 'Your Ad has been updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      setIsLoading(false);
      console.error('Update Ad Error:', error);
      Alert.alert('Error', error.message || 'Failed to update ad.');
    }
  };

  if (isFetching) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit your donation</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView 
          style={styles.content} 
          contentContainerStyle={{ paddingBottom: 150 }} 
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Item title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Key features of your item"
              value={title}
              onChangeText={setTitle}
              maxLength={70}
            />
            <Text style={styles.charCount}>{title.length} / 70</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Include condition, features and reason for donating"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={4000}
            />
            <Text style={styles.charCount}>{description.length} / 4000</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Indiranagar, Bangalore"
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitBtn} onPress={handleUpdate} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.submitBtnText}>Update now</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  content: { flex: 1, padding: 16 },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, color: COLORS.primary, marginBottom: 8, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, padding: 12, fontSize: 16, color: COLORS.primary },
  textArea: { height: 100, textAlignVertical: 'top' },
  charCount: { alignSelf: 'flex-end', fontSize: 12, color: COLORS.textLight, marginTop: 4 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, paddingHorizontal: 12 },
  currencyPrefix: { fontSize: 18, color: COLORS.primary, marginRight: 8, fontWeight: 'bold' },
  priceInput: { flex: 1, paddingVertical: 12, fontSize: 18, color: COLORS.primary },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.bg },
  submitBtn: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 4, alignItems: 'center' },
  submitBtnText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});
