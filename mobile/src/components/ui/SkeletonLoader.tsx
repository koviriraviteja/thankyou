/**
 * ThankU — SkeletonLoader Component
 *
 * Shimmer effect placeholder for loading states.
 * Bans blank screens with spinners (per 05-MOTION-ARCHITECTURE.md).
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { radius } from '../../theme/radius';

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width, height, borderRadius = radius.sm, style }: SkeletonProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width: width as any, height, borderRadius, opacity },
        style,
      ]}
    />
  );
}

/** Pre-built skeleton for a DonationCard */
export function CardSkeleton() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  return (
    <View style={styles.cardSkeleton}>
      <Skeleton width="100%" height={160} borderRadius={radius.md} />
      <View style={styles.cardSkeletonContent}>
        <Skeleton width="80%" height={14} />
        <Skeleton width="60%" height={12} style={{ marginTop: 8 }} />
        <Skeleton width="40%" height={10} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

/** Pre-built skeleton for a list item row */
export function ListSkeleton() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  return (
    <View style={styles.listSkeleton}>
      <Skeleton width={48} height={48} borderRadius={24} />
      <View style={styles.listSkeletonContent}>
        <Skeleton width="70%" height={14} />
        <Skeleton width="50%" height={12} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  skeleton: {
    backgroundColor: colors.border,
  },
  cardSkeleton: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: 12,
  },
  cardSkeletonContent: {
    padding: 12,
  },
  listSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  listSkeletonContent: {
    flex: 1,
  },
});
