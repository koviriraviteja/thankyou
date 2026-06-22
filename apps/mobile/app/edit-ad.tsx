/**
 * ThankU — Edit Donation Screen
 *
 * Edit an existing donation with ThankU branding.
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView,
  Platform, KeyboardAvoidingView, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../src/lib/supabase';
import { useAuth } from '../src/context/AuthContext';
import { useTheme } from '../src/context/ThemeContext';
import { typography } from '../src/theme/typography';
import { spacing } from '../src/theme/spacing';
import { radius } from '../src/theme/radius';
import { Button } from '../src/components/ui/Button';

export default function EditAdScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
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
    const { data } = await supabase.from('products').select('*').eq('id', id).single();
    if (data) {
      setTitle(data.title || '');
      setDescription(data.description || '');
      setLocation(data.location || '');
    }
    setIsFetching(false);
  };

  const handleUpdate = async () => {
    if (!title || !location) {
      Alert.alert('Missing Details', 'Please fill in the title and location to continue.');
      return;
    }
    setIsLoading(true);
    try {
      const { error: dbError } = await supabase
        .from('products')
        .update({ title, description, price: 'Free', location })
        .eq('id', id);
      if (dbError) throw dbError;
      setIsLoading(false);
      Alert.alert('Updated! 🎉', 'Your donation has been updated successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Error', error.message || 'Failed to update donation.');
    }
  };

  if (isFetching) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Donation</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 140 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="What are you giving away?"
              placeholderTextColor={colors.textDisabled}
              value={title}
              onChangeText={setTitle}
              maxLength={70}
            />
            <Text style={styles.charCount}>{title.length}/70</Text>
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Share the story of this item. Why are you giving it away?"
              placeholderTextColor={colors.textDisabled}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={4000}
            />
            <Text style={styles.charCount}>{description.length}/4000</Text>
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <View style={styles.locationInput}>
              <Ionicons name="location" size={18} color={colors.primary} />
              <TextInput
                style={styles.locationTextInput}
                placeholder="e.g. Anna Nagar, Chennai"
                placeholderTextColor={colors.textDisabled}
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title="Save Changes"
            onPress={handleUpdate}
            loading={isLoading}
            disabled={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.medium,
    paddingTop: spacing.medium,
  },
  inputGroup: {
    marginBottom: spacing.large,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.tiny,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.medium,
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    ...typography.caption,
    color: colors.textDisabled,
    alignSelf: 'flex-end',
    marginTop: spacing.micro,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.medium,
    backgroundColor: colors.background,
    gap: spacing.tiny,
  },
  locationTextInput: {
    flex: 1,
    paddingVertical: spacing.medium,
    ...typography.body,
    color: colors.textPrimary,
  },
  footer: {
    padding: spacing.medium,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
