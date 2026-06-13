/**
 * ThankU Design System — Typography Tokens
 * Source of Truth: 03-SPATIAL-DESIGN.md
 *
 * Font: Plus Jakarta Sans (bundled via expo-font)
 * Fallback: System default sans-serif
 */

import { TextStyle } from 'react-native';

export const fontFamily = {
  regular: 'PlusJakartaSans-Regular',
  medium: 'PlusJakartaSans-Medium',
  semiBold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
} as const;

// System fallbacks used before fonts load
export const fontFamilyFallback = {
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
} as const;

export const typography = {
  /** 48px Bold — Impact metrics ("124 kg") */
  display: {
    fontFamily: fontFamily.bold,
    fontSize: 48,
    lineHeight: 48 * 1.1,
    letterSpacing: -0.02 * 48,
    fontWeight: '700',
  } as TextStyle,

  /** 32px Bold — Onboarding headers, major screen titles */
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 32 * 1.2,
    letterSpacing: -0.01 * 32,
    fontWeight: '700',
  } as TextStyle,

  /** 24px SemiBold — Section titles, Item titles in detail views */
  h2: {
    fontFamily: fontFamily.semiBold,
    fontSize: 24,
    lineHeight: 24 * 1.3,
    fontWeight: '600',
  } as TextStyle,

  /** 18px SemiBold — Card titles, form group labels */
  h3: {
    fontFamily: fontFamily.semiBold,
    fontSize: 18,
    lineHeight: 18 * 1.4,
    fontWeight: '600',
  } as TextStyle,

  /** 16px Regular — Descriptions, chat messages */
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 16 * 1.5,
    fontWeight: '400',
  } as TextStyle,

  /** 14px Medium — Secondary descriptions, lists */
  bodySmall: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 14 * 1.5,
    fontWeight: '500',
  } as TextStyle,

  /** 16px SemiBold — Primary CTA text */
  label: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    lineHeight: 16 * 1.0,
    letterSpacing: 0.02 * 16,
    fontWeight: '600',
  } as TextStyle,

  /** 12px Medium — Timestamps, distances, tag text */
  caption: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 12 * 1.4,
    letterSpacing: 0.02 * 12,
    fontWeight: '500',
  } as TextStyle,
} as const;

export type TypographyTokens = typeof typography;
