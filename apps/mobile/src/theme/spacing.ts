/**
 * ThankU Design System — Spacing Tokens (8pt Grid)
 * Source of Truth: 03-SPATIAL-DESIGN.md
 */

export const spacing = {
  /** 4px — Between an icon and its text label */
  micro: 4,
  /** 8px — Between stacked form inputs or list items */
  tiny: 8,
  /** 12px — Compact internal padding */
  small: 12,
  /** 16px — Standard component padding, default screen margin */
  medium: 16,
  /** 24px — Between distinct sections within a card */
  large: 24,
  /** 32px — Between major layout sections */
  xl: 32,
  /** 48px — Before a fixed bottom CTA area */
  xxl: 48,
  /** 64px — Extra large vertical spacing */
  xxxl: 64,
} as const;

export type SpacingTokens = typeof spacing;
