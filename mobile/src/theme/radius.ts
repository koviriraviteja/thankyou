/**
 * ThankU Design System — Border Radius Tokens (High-Contrast Modern)
 * Source of Truth: 03-SPATIAL-DESIGN.md
 *
 * Sharper, sleeker corners compared to the previous ultra-soft theme.
 */

export const radius = {
  /** 0px — Full bleed images touching screen edges */
  none: 0,
  /** 2px — Checkboxes, small status tags */
  xs: 2,
  /** 6px — Secondary buttons, text inputs, small imagery */
  sm: 6,
  /** 12px — Primary buttons, item cards, profile avatars (sharpened from 16) */
  md: 12,
  /** 20px — Large feature cards, modals, dialog boxes */
  lg: 20,
  /** 24px — Bottom sheets (top corners only) */
  xl: 24,
  /** 9999px — Circular avatars, FABs, icon buttons */
  full: 9999,
} as const;

export type RadiusTokens = typeof radius;
