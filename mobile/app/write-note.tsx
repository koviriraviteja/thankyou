import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import { typography } from '../src/theme/typography';
import { spacing } from '../src/theme/spacing';
import { radius } from '../src/theme/radius';
import { shadows } from '../src/theme/shadows';
import { Button } from '../src/components/ui/Button';

export default function WriteNoteScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = () => {
    // In a real app, this would save to Supabase
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Write a Note</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Say Thank You! 🌟</Text>
        <Text style={styles.subtitle}>
          Express your gratitude to a neighbor who gave you an item. Your note will be visible on the public Gratitude Wall.
        </Text>

        {/* Rating */}
        <View style={styles.ratingSection}>
          <Text style={styles.label}>Rate your experience</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={40}
                  color={colors.gold}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Note Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Your Message</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Rahul is amazing! The chair is perfect..."
            placeholderTextColor={colors.textDisabled}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={message}
            onChangeText={setMessage}
          />
        </View>

      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <Button
          title="Post Note"
          onPress={handleSubmit}
          disabled={!message.trim()}
          icon={<Ionicons name="send" size={18} color={colors.textOnPrimary} />}
        />
      </View>
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
    paddingVertical: spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.medium,
    paddingBottom: 100,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.tiny,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  ratingSection: {
    marginBottom: spacing.large,
    alignItems: 'center',
  },
  label: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.small,
  },
  starsRow: {
    flexDirection: 'row',
    gap: spacing.small,
  },
  inputSection: {
    marginBottom: spacing.large,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    padding: spacing.medium,
    ...typography.body,
    color: colors.textPrimary,
    minHeight: 150,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.medium,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.lg,
  },
});
