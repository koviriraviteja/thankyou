/**
 * ThankU — EmptyState Component
 *
 * Beautifully designed empty states that inspire rather than disappoint.
 * Source of Truth: 04-BRAND-AURA.md (Section 6)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  imageSource?: any;
  title: string;
  body: string;
  ctaTitle?: string;
  onCtaPress?: () => void;
}

export function EmptyState({
  icon,
  iconColor = colors.secondary,
  imageSource,
  title,
  body,
  ctaTitle,
  onCtaPress,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {imageSource ? (
        <Image 
          source={imageSource} 
          style={{ width: 160, height: 160, marginBottom: spacing.medium }} 
          contentFit="contain" 
        />
      ) : icon ? (
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={48} color={iconColor} />
        </View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      {ctaTitle && onCtaPress && (
        <View style={styles.ctaWrapper}>
          <Button title={ctaTitle} onPress={onCtaPress} size="md" fullWidth={false} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.large,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.tiny,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  ctaWrapper: {
    marginTop: spacing.large,
  },
});
