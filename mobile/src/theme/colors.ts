/**
 * ThankU Design System — Color Tokens (High-Contrast Modern)
 * Source of Truth: 03-SPATIAL-DESIGN.md
 *
 * All colors in the app MUST reference these tokens.
 * Hardcoding hex values in components is strictly banned.
 */

export const colors = {
  // ─── Core Brand ───────────────────────────────────────
  primary: '#0F172A',       // Luxury Midnight Slate — Primary buttons, active tabs
  secondary: '#5ED6E3',     // Logo Cyan — Secondary accents, badges
  accent: '#D4AF37',        // Champagne Gold — High-end accents

  // ─── Semantic ─────────────────────────────────────────
  success: '#059669',       // Deep Emerald
  warning: '#D97706',       // Deep Amber
  error: '#DC2626',         // Classic Red
  info: '#2563EB',          // Royal Blue

  // ─── Emotional / Brand Accent ─────────────────────────
  gold: '#D4AF37',          // Champagne Gold
  coral: '#E17055',         // Soft Terracotta
  purple: '#6D28D9',        // Deep Royal Purple

  // ─── Surfaces ─────────────────────────────────────────
  background: '#FAFAFA',    // Ultra-light Platinum Gray — High-end background
  surface: '#FFFFFF',       // Pure White — Cards, modals
  highlight: '#F1F5F9',     // Slate 100 — Selected states

  // ─── Text ─────────────────────────────────────────────
  textPrimary: '#111827',   // Deep Slate — Headings, core body text
  textSecondary: '#6B7280', // Cool Gray — Metadata, timestamps
  textDisabled: '#9CA3AF',  // Light Gray — Disabled buttons
  textOnPrimary: '#FFFFFF', // Pure White on Midnight Slate buttons

  // ─── Borders ──────────────────────────────────────────
  border: '#E5E7EB',        // Crisp Platinum — Default card borders
  borderStrong: '#D1D5DB',  // Slate 300
  divider: '#F3F4F6',       // Section dividers

  // ─── Overlays ─────────────────────────────────────────
  overlay: 'rgba(10, 12, 16, 0.6)',
  overlayLight: 'rgba(10, 12, 16, 0.3)',
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
