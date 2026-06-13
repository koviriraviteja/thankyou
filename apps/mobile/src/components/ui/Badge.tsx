/**
 * ThankU — Badge Component
 *
 * Variants: trust, category, condition, status
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';

type BadgeVariant = 'trust' | 'category' | 'condition' | 'status';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: keyof typeof Ionicons.glyphMap;
}

const VARIANT_STYLES = {
  trust: { bg: '#ECFDF5', color: colors.success, iconColor: colors.success },
  category: { bg: colors.highlight, color: colors.primary, iconColor: colors.primary },
  condition: { bg: colors.highlight, color: colors.accent, iconColor: colors.accent },
  status: { bg: colors.highlight, color: colors.textSecondary, iconColor: colors.textSecondary },
};

export function Badge({ label, variant = 'category', icon }: BadgeProps) {
  const style = VARIANT_STYLES[variant];

  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      {icon && <Ionicons name={icon} size={12} color={style.iconColor} style={{ marginRight: 3 }} />}
      <Text style={[styles.text, { color: style.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.tiny,
    paddingVertical: 3,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.caption,
    fontWeight: '700',
    fontSize: 10,
  },
});
