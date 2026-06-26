/**
 * ThankU Design System — Shadow / Elevation Tokens (High-Contrast Modern)
 * Source of Truth: 03-SPATIAL-DESIGN.md
 *
 * Shadows are deeper and more realistic, giving a floating "Apple Wallet" vibe.
 */

import { ViewStyle } from 'react-native';

export const shadows = {
  /** Flat — Uses borders instead */
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,

  /** Resting cards in feeds */
  sm: {
    shadowColor: '#0A0C10',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  } as ViewStyle,

  /** Hover / Active / Selected cards */
  md: {
    shadowColor: '#0A0C10',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  } as ViewStyle,

  /** Sticky navs / Headers */
  lg: {
    shadowColor: '#0A0C10',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 28,
    elevation: 6,
  } as ViewStyle,

  /** Modals / Dialogs */
  xl: {
    shadowColor: '#0A0C10',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 8,
  } as ViewStyle,

  /** Bottom sheets (upward shadow) */
  sheet: {
    shadowColor: '#0A0C10',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  } as ViewStyle,

  /** FAB / Floating Action Button — Most prominent, tinted with primary neon */
  fab: {
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
  } as ViewStyle,
} as const;

export type ShadowTokens = typeof shadows;
