/**
 * ThankU — DonationCard Component
 *
 * Used in the Home Feed. Image-first layout (60% height).
 * Displays item image, title, condition badge, distance, and donor info.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';

interface DonationCardProps {
  id: string;
  title: string;
  imageUrl: string;
  location: string;
  distance?: string;
  condition?: string;
  category?: string;
  createdAt: string;
  isFavorite?: boolean;
  onPress: () => void;
  onFavoritePress?: () => void;
  donorName?: string;
  donorAvatar?: string;
  isVerified?: boolean;
  rating?: string;
  price?: number;
  originalPrice?: number;
}

export function DonationCard({
  title,
  imageUrl,
  location,
  distance,
  condition,
  createdAt,
  isFavorite = false,
  onPress,
  onFavoritePress,
  donorName,
  isVerified = false,
  rating = '4.5',
  price,
  originalPrice,
}: DonationCardProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const timeStr = new Date(createdAt).toLocaleDateString();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            {condition && <Text style={styles.conditionText} numberOfLines={1}>{condition}</Text>}
          </View>
          {onFavoritePress && (
            <TouchableOpacity onPress={onFavoritePress}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={16}
                color={isFavorite ? colors.coral : '#1C1C1E'}
              />
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.priceText, { color: '#34C759', fontWeight: 'bold' }]}>
          {price ? `₹ ${price.toLocaleString('en-IN')}` : 'FREE'}
        </Text>
        <Text style={styles.distanceText} numberOfLines={1}>
          {distance ? distance : '1.2 km away'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
    marginBottom: spacing.small,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: colors.highlight,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: spacing.small,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 4,
  },
  conditionText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  title: {
    color: colors.textPrimary,
    marginBottom: spacing.micro,
    fontWeight: '600',
    minHeight: 44, // 2 lines of bodySmall (lineHeight ~22.4)
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.micro,
    gap: 6,
  },
  priceText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  originalPriceText: {
    ...typography.caption,
    color: colors.textDisabled,
    textDecorationLine: 'line-through',
  },
  distanceText: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.micro,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flex: 1,
    marginRight: spacing.tiny,
  },
  metaText: {
    ...typography.caption,
    color: colors.textDisabled,
    fontSize: 10,
  },
});
