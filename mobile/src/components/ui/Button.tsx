/**
 * ThankU — Button Component
 * 
 * Variants: primary, secondary, ghost, danger
 * Sizes: sm (40px), md (48px), lg (56px)
 * Features: Loading state, disabled state, left icon
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { LinearGradient } from 'expo-linear-gradient';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const HEIGHTS: Record<ButtonSize, number> = { sm: 40, md: 48, lg: 56 };

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  icon,
  fullWidth = true,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle[] = [
    styles.base,
    { height: HEIGHTS[size] },
    getVariantStyles(colors)[variant].container,
    isDisabled && styles.disabled,
    fullWidth && styles.fullWidth,
    style as ViewStyle,
  ];

  const textStyle: TextStyle[] = [
    styles.text,
    getVariantStyles(colors)[variant].text,
    size === 'sm' && styles.textSmall,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {variant === 'primary' && (
        <LinearGradient
          colors={['#4BC6D3', colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFill, { borderRadius: 999 }]}
        />
      )}
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger' ? colors.surface : colors.primary}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          <Text style={textStyle}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const getVariantStyles = (colors: any) => ({
  primary: {
    container: {
      backgroundColor: 'transparent',
      overflow: 'hidden',
      borderWidth: 0,
    } as ViewStyle,
    text: {
      color: colors.textOnPrimary,
    } as TextStyle,
  },
  secondary: {
    container: {
      backgroundColor: colors.highlight,
    } as ViewStyle,
    text: {
      color: colors.accent,
    } as TextStyle,
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
    } as ViewStyle,
    text: {
      color: colors.textSecondary,
    } as TextStyle,
  },
  danger: {
    container: {
      backgroundColor: colors.error,
    } as ViewStyle,
    text: {
      color: colors.surface,
    } as TextStyle,
  },
});

const getStyles = (colors: any) => StyleSheet.create({
  base: {
    borderRadius: 999, // Fully rounded

    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrapper: {
    marginRight: 4,
  },
  text: {
    ...typography.label,
  },
  textSmall: {
    fontSize: 14,
  },
});
