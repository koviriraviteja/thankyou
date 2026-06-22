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

        {/* Rating Badge */}
        {rating && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={10} color={colors.surface} />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        )}

        {/* Favorite Button */}
        {onFavoritePress && (
          <TouchableOpacity style={styles.favoriteBtn} onPress={onFavoritePress}>
            <Ionicons
              name="heart"
              size={16}
              color={isFavorite ? colors.coral : colors.textPrimary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.priceText}>{price ? `₹ ${price.toLocaleString('en-IN')}` : 'Free'}</Text>
          {originalPrice && (
            <Text style={styles.originalPriceText}>₹{originalPrice.toLocaleString('en-IN')}</Text>
          )}
        </View>

        <View style={styles.metaRow}>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {distance ? distance : location?.split(',')[0]}
            </Text>
          </View>
          <Text style={styles.metaText}>{timeStr}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
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
  favoriteBtn: {
    position: 'absolute',
    top: spacing.tiny,
    right: spacing.tiny,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  ratingBadge: {
    position: 'absolute',
    top: spacing.tiny,
    left: spacing.tiny,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    gap: 2,
  },
  ratingText: {
    ...typography.caption,
    color: colors.surface,
    fontWeight: '700',
    fontSize: 10,
  },
  content: {
    padding: spacing.small,
  },
  title: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    marginBottom: spacing.micro,
    fontWeight: '600',
    height: 38,
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
