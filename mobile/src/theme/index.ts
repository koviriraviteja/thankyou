/**
 * ThankU Design System — Unified Theme Export
 *
 * Import everything from here:
 *   import { theme } from '@/theme';
 *   theme.colors.primary
 *   theme.typography.h1
 *   theme.spacing.medium
 */

export { colors, darkColors } from './colors';
export type { ColorTokens } from './colors';

export { typography, fontFamily, fontFamilyFallback } from './typography';
export type { TypographyTokens } from './typography';

export { spacing } from './spacing';
export type { SpacingTokens } from './spacing';

export { radius } from './radius';
export type { RadiusTokens } from './radius';

export { shadows } from './shadows';
export type { ShadowTokens } from './shadows';

// Convenience unified object
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';
import { shadows } from './shadows';

export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
} as const;
