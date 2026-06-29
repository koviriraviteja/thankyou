/**
 * ThankU Design System — Color Tokens (High-Contrast Modern)
 * Source of Truth: 03-SPATIAL-DESIGN.md
 *
 * All colors in the app MUST reference these tokens.
 * Hardcoding hex values in components is strictly banned.
 */

export const colors = {
  // ─── Core Brand ───────────────────────────────────────
  primary: '#0066FF',       // Bright Blue
  secondary: '#34C759',     // Vibrant Green
  accent: '#0052CC',        // Darker blue

  // ─── Semantic ─────────────────────────────────────────
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',

  // ─── Emotional / Brand Accent ─────────────────────────
  gold: '#FFD60A',
  coral: '#FF6B22',
  purple: '#AF52DE',

  // ─── Surfaces ─────────────────────────────────────────
  background: '#F5F7FA',    // Slightly off-white for app background
  surface: '#FFFFFF',       // Pure White — Cards, modals
  highlight: '#F0F4F8',     // Light grey-blue for selected states

  // ─── Text ─────────────────────────────────────────────
  textPrimary: '#1C1C1E',   // Almost Black
  textSecondary: '#8E8E93', // Cool Gray
  textDisabled: '#C7C7CC',  // Light Gray
  textOnPrimary: '#FFFFFF', // Pure White on Buttons

  // ─── Borders ──────────────────────────────────────────
  border: '#E5E5EA',        // Light Border
  borderStrong: '#D1D1D6',  // Stronger Border
  divider: '#E5E5EA',       // Section dividers

  // ─── Overlays ─────────────────────────────────────────
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
} as const;

// ─── Dark Mode Tokens (Linear Inspired) ───────────────────
export const darkColors = {
  ...colors,
  primary: '#00E5FF',       // Neon Cyan — High-contrast for dark mode
  secondary: '#00B8D4',     // Deep Cyan
  accent: '#1DE9B6',        // Vibrant Teal
  background: '#0A0C10',    // Ultra Deep Slate / Midnight
  surface: '#111827',       // Dark Slate — Cards, modals
  highlight: '#1F2937',     // Elevated Slate
  textPrimary: '#F9FAFB',   // Pure White text
  textSecondary: '#9CA3AF', // Muted Gray
  textDisabled: '#4B5563',  // Dark Gray
  textOnPrimary: '#0A0C10', // Dark Slate on Neon buttons
  border: '#1F2937',        // Subtle dark borders
  borderStrong: '#374151',  // Stronger dark borders
  divider: '#111827',       // Section dividers
  overlay: 'rgba(0, 0, 0, 0.8)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
} as const;

export type ColorTokens = typeof colors;
