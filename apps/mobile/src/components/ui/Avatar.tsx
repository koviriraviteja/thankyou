/**
 * ThankU — Avatar Component
 *
 * Circular avatar with optional impact tier ring (Seedling/Sapling/Oak/Forest).
 */

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
type ImpactTier = 'seedling' | 'sapling' | 'oak' | 'forest' | null;

interface AvatarProps {
  uri?: string | null;
  size?: AvatarSize;
  tier?: ImpactTier;
}

const SIZES: Record<AvatarSize, number> = { sm: 32, md: 44, lg: 64, xl: 80 };
const ICON_SIZES: Record<AvatarSize, number> = { sm: 14, md: 20, lg: 28, xl: 36 };

const TIER_COLORS: Record<string, string> = {
  seedling: '#86EFAC',
  sapling: colors.success,
  oak: colors.gold,
  forest: colors.purple,
};

export function Avatar({ uri, size = 'md', tier = null }: AvatarProps) {
  const dim = SIZES[size];
  const borderWidth = tier ? 3 : 0;
  const borderColor = tier ? TIER_COLORS[tier] : 'transparent';

  return (
    <View style={[styles.container, { width: dim, height: dim, borderRadius: dim / 2, borderWidth, borderColor }]}>
      {uri ? (
        <Image source={{ uri }} style={[styles.image, { width: dim - borderWidth * 2, height: dim - borderWidth * 2, borderRadius: (dim - borderWidth * 2) / 2 }]} />
      ) : (
        <View style={[styles.placeholder, { width: dim - borderWidth * 2, height: dim - borderWidth * 2, borderRadius: (dim - borderWidth * 2) / 2 }]}>
          <Ionicons name="person" size={ICON_SIZES[size]} color={colors.surface} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
