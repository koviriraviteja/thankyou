/**
 * ThankU Design System — Color Tokens
 * Source of Truth: 03-SPATIAL-DESIGN.md
 *
 * All colors in the app MUST reference these tokens.
 * Hardcoding hex values in components is strictly banned.
 */

export const colors = {
  // ─── Core Brand ───────────────────────────────────────
  primary: '#5ED6E3',       // Soft Cyan — Primary actions, active tabs, main branding
  secondary: '#A8EEF4',     // Muted Cyan — Secondary buttons, subtle highlights
  accent: '#00B8D4',        // Deep Cyan — Hover states, text links, high-emphasis icons

  // ─── Semantic ─────────────────────────────────────────
  success: '#2ECC71',       // Emerald — Completed pickups, verified states
  warning: '#F59E0B',       // Amber — Pending actions, expiring time slots
  error: '#EF4444',         // Soft Red — ONLY for destructive actions (Delete, Report)
  info: '#3B82F6',          // Calm Blue — Tooltips, neutral information

  // ─── Emotional / Brand Accent ─────────────────────────
  gold: '#FFD166',          // Gratitude Gold — Gratitude Wall, Applaud, Leaderboard crowns
  coral: '#FFB4A2',         // Kindness Coral — Human warmth, heart icons, empathy UI
  purple: '#8B8CF7',        // Community Purple — Local Hero badges, milestones

  // ─── Surfaces ─────────────────────────────────────────
  background: '#F6FEFF',    // Icy White — Absolute base layer
  surface: '#FFFFFF',       // Pure White — Cards, modals, bottom sheets
  highlight: '#DDFBFF',     // Ultra-light Cyan — Selected states, active list items

  // ─── Text ─────────────────────────────────────────────
  textPrimary: '#111827',   // Deep Slate — Headings, core body text. Never use #000
  textSecondary: '#6B7280', // Cool Gray — Metadata, timestamps, placeholders
  textDisabled: '#9CA3AF',  // Light Gray — Disabled buttons, empty states
  textOnPrimary: '#111827', // Dark Slate on Cyan buttons — WCAG AA compliance

  // ─── Borders ──────────────────────────────────────────
  border: '#E6F7FA',        // Soft Cyan tint — Default card & input borders
  borderStrong: '#B0E8F0',  // Slightly stronger for focus states
  divider: '#F3F4F6',       // Section dividers

  // ─── Overlays ─────────────────────────────────────────
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
} as const;

// ─── Dark Mode Tokens ─────────────────────────────────────
export const darkColors = {
  ...colors,
  background: '#0F172A',    // Deep Navy
  surface: '#1E293B',       // Slightly lighter
  highlight: '#1A3A4A',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textDisabled: '#475569',
  textOnPrimary: '#111827',
  border: '#334155',
  borderStrong: '#475569',
  divider: '#1E293B',
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
} as const;

export type ColorTokens = typeof colors;
