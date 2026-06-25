/**
 * ThankU Design System — Shadow / Elevation Tokens
 * Source of Truth: 03-SPATIAL-DESIGN.md
 *
 * Shadows are never black (#000). They are tinted with the primary
 * palette to feel integrated, not dirty.
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
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  } as ViewStyle,

  /** Hover / Active / Selected cards */
  md: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  } as ViewStyle,

  /** Sticky navs / Headers */
  lg: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  } as ViewStyle,

  /** Modals / Dialogs */
  xl: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 4,
  } as ViewStyle,

  /** Bottom sheets (upward shadow) */
  sheet: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 5,
  } as ViewStyle,

  /** FAB / Floating Action Button — Most prominent */
  fab: {
    shadowColor: '#00B8D4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  } as ViewStyle,
} as const;

export type ShadowTokens = typeof shadows;
