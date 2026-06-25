/**
 * ThankU Design System — Border Radius Tokens
 * Source of Truth: 03-SPATIAL-DESIGN.md
 *
 * Softness implies safety. Harsh 90° corners banned (except full-bleed images).
 */

export const radius = {
  /** 0px — Full bleed images touching screen edges */
  none: 0,
  /** 4px — Checkboxes, small status tags */
  xs: 4,
  /** 8px — Secondary buttons, text inputs, small imagery */
  sm: 8,
  /** 16px — Primary buttons, item cards, profile avatars */
  md: 16,
  /** 24px — Large feature cards, modals, dialog boxes */
  lg: 24,
  /** 32px — Bottom sheets (top corners only) */
  xl: 32,
  /** 9999px — Circular avatars, FABs, icon buttons */
  full: 9999,
} as const;

export type RadiusTokens = typeof radius;
