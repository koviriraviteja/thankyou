import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/context/ThemeContext';
import { typography } from '../src/theme/typography';
import { spacing } from '../src/theme/spacing';
import { radius } from '../src/theme/radius';
import { shadows } from '../src/theme/shadows';

const CATEGORIES = ['Education', 'Medical', 'Food', 'Household', 'Emergency', 'Other'];
const URGENCY_LEVELS = ['Low', 'Medium', 'High'];

export default function CreateRequestScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState('');

  const handlePost = () => {
    if (!title || !description || !category || !urgency) {
      Alert.alert('Missing Fields', 'Please fill out all fields to post your request.');
      return;
    }
    // Mock submit
    router.back();
    // Use a small timeout so the modal closing animation finishes first
    setTimeout(() => {
      Alert.alert('Request Posted!', 'Your community has been notified. We hope you get the help you need soon.');
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ask for Help</Text>
          <TouchableOpacity onPress={handlePost}>
            <Text style={styles.postText}>Post</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {/* Title */}
          <Text style={styles.label}>What do you need help with?</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="e.g., Need 5 notebooks for 10th grade"
            placeholderTextColor={colors.textDisabled}
            value={title}
            onChangeText={setTitle}
            maxLength={60}
          />

          {/* Description */}
          <Text style={styles.label}>Describe your situation</Text>
          <TextInput
            style={styles.descInput}
            placeholder="Share why you need this and how it will help you..."
            placeholderTextColor={colors.textDisabled}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />

          {/* Category */}
          <Text style={styles.label}>Category</Text>
          <View style={styles.pillContainer}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.pill, category === cat && styles.pillActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.pillText, category === cat && styles.pillTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Urgency */}
          <Text style={styles.label}>Urgency Level</Text>
          <View style={styles.pillContainer}>
            {URGENCY_LEVELS.map(level => (
              <TouchableOpacity
                key={level}
                style={[styles.pill, urgency === level && styles.pillActive]}
                onPress={() => setUrgency(level)}
              >
                <Text style={[styles.pillText, urgency === level && styles.pillTextActive]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Add Media */}
          <Text style={styles.label}>Add Photos (Optional)</Text>
          <TouchableOpacity style={styles.mediaUpload}>
            <Ionicons name="camera-outline" size={32} color={colors.primary} />
            <Text style={styles.mediaUploadText}>Tap to add photo</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.medium,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cancelText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  postText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.primary,
  },
  content: {
    padding: spacing.medium,
    paddingBottom: spacing.xxl,
  },
  label: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.large,
    marginBottom: spacing.small,
  },
  titleInput: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    padding: spacing.medium,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  descInput: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    padding: spacing.medium,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 120,
    ...shadows.sm,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.small,
  },
  pill: {
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  pillTextActive: {
    color: colors.surface,
  },
  mediaUpload: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.tiny,
    marginTop: spacing.tiny,
    ...shadows.sm,
  },
  mediaUploadText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
