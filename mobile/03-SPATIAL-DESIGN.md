# [03-SPATIAL-DESIGN.md]

*Drafted by the Principal Design Council (Apple + Airbnb + Patagonia + Notion). This document serves as the absolute, high-fidelity source of truth for all UI/UX design, React Native development, and Brand Identity.*

---

## 1. Brand Atmosphere

The brand atmosphere dictates the physiological response users have when opening the app.

### Emotional Personality
**Calm, Safe, and Uplifting.** The app must feel like stepping out of a noisy, chaotic street market (traditional classifieds) and into a quiet, well-lit, beautifully designed community center where people are inherently good.

### Visual Personality
**Pristine, Spacious, and Soft.** Generous use of negative space (`#F6FEFF`). Harsh lines are eliminated in favor of soft, continuous curves. The interface gets out of the way to let the human stories and item imagery shine.

### Sensory Personality
**Tactile and Gentle.** Interactions should feel physical but light. A soft haptic *thud* when dropping an item into a category; a gentle visual *spring* when a modal opens. Nothing snaps aggressively.

### Interaction Personality
**Anticipatory and Guided.** The app never leaves the user guessing. Every empty state is a beautiful illustration. Every button clearly communicates the next state.

### Community Personality
**Generous and Respectful.** The UI visually elevates "Thank You" notes above "Item Listings." Trust is visualized via elegant, unobtrusive shields, not loud warning banners.

---

## 2. Visual Theme System

### Primary Theme (The "Daylight" Theme)
*   **Mood:** Fresh, optimistic, clean.
*   **Usage:** The default state for 90% of users. Ideal for showcasing photos of items in natural light.
*   **Visual Differences:** Relies heavily on the `Background: #F6FEFF` and `Surface: #FFFFFF` to create a lightweight, airy feel. Shadows are soft, tinted slightly with the primary cyan to avoid dirty gray/black hues.

### Alternate Theme (The "Focus" Theme)
*   **Mood:** Deep, cinematic, immersive.
*   **Usage:** For the Impact Dashboard and Trust Center. 
*   **Visual Differences:** Reverses the hierarchy. Deep, rich dark backgrounds (e.g., `#0A192F`) to make the Gratitude Gold (`#FFD166`) and Primary Cyan (`#5ED6E3`) data visualizations pop with high contrast.

### Dark Mode Strategy
*   **Mood:** Restful, premium.
*   **Usage:** System-sync default. Crucial for nighttime browsing in bed.
*   **Visual Differences:** Background shifts to deep navy/charcoal (`#0F172A`). Surfaces become slightly lighter (`#1E293B`). The Primary Cyan `#5ED6E3` remains the accent but is slightly desaturated to prevent eye strain. True black (`#000000`) is avoided.

### Accessibility Theme (High Contrast)
*   **Mood:** Utilitarian, clear.
*   **Usage:** For users with vision impairments.
*   **Visual Differences:** Border contrast is dramatically increased. Subtle background tints are removed in favor of pure white/black. Cyan accents are darkened to `#00829B` to meet WCAG AAA contrast ratios against white.

---

## 3. Advanced Color Architecture

### Core Palette
*   **Primary:** `#5ED6E3` (Soft Cyan) - Use for primary actions, active tabs, main branding.
*   **Secondary:** `#A8EEF4` (Muted Cyan) - Use for secondary buttons, subtle highlights.
*   **Accent:** `#00B8D4` (Deep Cyan) - Use for interactive hover states, text links, high-emphasis icons.

### Semantic Palette
*   **Success:** `#2ECC71` (Emerald) - Use for completed pickups, verified states.
*   **Warning/Caution:** `#F59E0B` (Amber) - Use for pending actions, expiring time slots.
*   **Error/Danger:** `#EF4444` (Soft Red) - Use sparingly. Account deletion, reporting users.
*   **Info:** `#3B82F6` (Calm Blue) - Tooltips, neutral information.

### Surface Hierarchy
*   **Background Base:** `#F6FEFF` (Icy White) - The absolute base layer.
*   **Surface Level 1:** `#FFFFFF` (Pure White) - Cards, modals, bottom sheets.
*   **Highlight:** `#DDFBFF` (Ultra-light Cyan) - Selected states, active list items.

### Text Hierarchy
*   **Text Primary:** `#111827` (Deep Slate) - Headings, core body text. Never use pure `#000000`.
*   **Text Secondary:** `#6B7280` (Cool Gray) - Metadata, timestamps, placeholders.
*   **Text Disabled:** `#9CA3AF` (Light Gray) - Disabled buttons, empty states.

### Emotional Color Palette
*   **Gratitude Gold:** `#FFD166` - Used exclusively for the Gratitude Wall, 'Applaud' animations, and Leaderboard crowns.
*   **Kindness Coral:** `#FFB4A2` - Used in illustrations to represent human warmth, heart icons, and empathy-driven UI.
*   **Community Purple:** `#8B8CF7` - Used for "Local Hero" badges, community milestones, and network-effect visuals.

---

## 4. Typography System

**Recommended Font Family:** **Plus Jakarta Sans** (Geometric, incredibly legible on mobile, inherently friendly but highly professional) or **Inter** (The ultimate functional workhorse). *We will assume Plus Jakarta Sans for its modern, premium feel.*

### Hierarchy Definition (React Native `Text` components)
*   **Display:** 48px | Weight: Bold (700) | Line Height: 1.1 | Tracking: -0.02em | Use: "Impact" metrics (`124 kg`).
*   **Hero (H1):** 32px | Weight: Bold (700) | Line Height: 1.2 | Tracking: -0.01em | Use: Onboarding headers, major screen titles.
*   **Heading (H2):** 24px | Weight: SemiBold (600) | Line Height: 1.3 | Tracking: 0 | Use: Section titles, Item Titles in detail views.
*   **Section (H3):** 18px | Weight: SemiBold (600) | Line Height: 1.4 | Tracking: 0 | Use: Card titles, Form group labels.
*   **Body Primary:** 16px | Weight: Regular (400) | Line Height: 1.5 | Tracking: 0 | Use: The "Why I need this" descriptions, Chat messages.
*   **Body Secondary:** 14px | Weight: Medium (500) | Line Height: 1.5 | Tracking: 0 | Use: Secondary descriptions, lists.
*   **Label/Button:** 16px | Weight: SemiBold (600) | Line Height: 1.0 | Tracking: 0.02em | Use: Primary CTA text.
*   **Caption:** 12px | Weight: Medium (500) | Line Height: 1.4 | Tracking: 0.02em | Use: Timestamps, distance ("1.2 km away"), tag text.

---

## 5. Spacing System (8pt Grid)

All margins, paddings, and sizing must be multiples of 8 (with 4pt allowed for micro-adjustments).

*   **Base Unit:** 8px.
*   **Micro (`space-1`):** 4px - Between an icon and its text label.
*   **Tiny (`space-2`):** 8px - Between stacked form inputs or list items.
*   **Small (`space-3`):** 16px - Standard component padding (inside buttons, cards). The default screen margin.
*   **Medium (`space-4`):** 24px - Spacing between distinct sections within a card.
*   **Large (`space-5`):** 32px - Spacing between major layout sections (e.g., between "Description" and "Donor Profile" on an Item screen).
*   **XL (`space-6`):** 48px - Spacing before a fixed bottom CTA area.
*   **Mobile Safe Area:** Minimum 16px horizontal margin on all screens. Bottom safe areas must account for iOS home indicators.

---

## 6. Border Radius System

Softness implies safety. Harsh 90-degree corners are banned except for full-bleed images.

*   **None (`radius-0`):** 0px - Full bleed images touching screen edges.
*   **Tiny (`radius-xs`):** 4px - Checkboxes, small status tags (e.g., "Used").
*   **Small (`radius-sm`):** 8px - Secondary buttons, text inputs, small imagery.
*   **Medium (`radius-md`):** 16px - Primary Buttons, Item Cards in feed, Profile avatars (if not circular).
*   **Large (`radius-lg`):** 24px - Large feature cards, Modals, Dialog boxes.
*   **XL (`radius-xl`):** 32px - Native Bottom Sheets (top corners only).
*   **Full (`radius-full`):** 9999px - Circular avatars, FABs (Floating Action Buttons), Icon buttons.

---

## 7. Shadow & Elevation System

Shadows must never be black (`#000000`). They should be tinted with the primary cyan (`#5ED6E3`) or deep slate to feel integrated, not dirty.

*   **Elevation 0:** Flat. Borders used instead (`Border: #E6F7FA`).
*   **Elevation 1 (Resting Cards):** `Y: 2`, `Blur: 8`, `Opacity: 0.04`, `Color: #111827`. Use for feed items.
*   **Elevation 2 (Hover/Active Cards):** `Y: 4`, `Blur: 12`, `Opacity: 0.08`, `Color: #111827`. Use for selected states.
*   **Elevation 3 (Sticky Navs/Headers):** `Y: 4`, `Blur: 16`, `Opacity: 0.06`. 
*   **Elevation 4 (Modals/Dialogs):** `Y: 8`, `Blur: 24`, `Opacity: 0.12`. Creates significant separation.
*   **Elevation 5 (Bottom Sheets):** `Y: -4` (upward), `Blur: 24`, `Opacity: 0.10`.
*   **Elevation 6 (FAB/Floating Action Button):** `Y: 8`, `Blur: 16`, `Opacity: 0.25`, `Color: #00B8D4`. The most prominent shadow on the screen to draw the eye to the "Donate" button.

---

## 8. Component Design System

### Buttons
*   **Primary:** Solid background (`#5ED6E3`), text (`#111827` - Dark Slate for WCAG AA Contrast Compliance), Radius `Medium` (16px). Height: 56px (extremely tap-friendly).
*   **Secondary:** Background (`#E6F7FA`), text (`#00B8D4`).
*   **Ghost:** Transparent background, text (`#6B7280`). Used for "Cancel" or "Skip".
*   **Disabled:** Background (`#F3F4F6`), text (`#9CA3AF`).

### Inputs
*   **Text Inputs:** Height 56px. Background (`#FFFFFF`). Border (`#E6F7FA`, 1px). Focus State: Border shifts to `#5ED6E3` (2px). Label text floats or sits outside.
*   **Text Areas:** Min-height 120px. Used for "Why I need this" or ThankU notes. Include a subtle character counter in the bottom right.

### Cards
*   **Donation Card (Home Feed):** Image takes up 60% of card height. No internal padding for image. Title and Distance below image. Radius `Medium`. Elevation 1.
*   **Trust Card:** Displays Avatar, Name, Verified Shield, and Community Score (4.9 ★). Background (`#FAFAFA`), Border (`#E6F7FA`).

### Modals
*   **Bottom Sheets:** Preferred over center-screen dialogs for mobile ergonomics. Top corners Radius `XL`. A small 4x40px drag handle at the top (`#E5E7EB`).

---

### Filter Toggles
*   **Fluid Pill Morphing:** When shifting a filter from "Furniture" to "Books," the active background pill smoothly glides across the text using Reanimated `SharedValue` interpolation, rather than snapping.


## 9. Screen-by-Screen Design Blueprint

### 1. Home Feed
*   **Layout:** Top App Bar (Greeting + Profile Avatar) -> Categories Strip (Horizontal Scroll) -> Masonry Grid of items.
*   **Visual Hierarchy:** Item Image > Item Title > Distance.
*   **Component Usage:** Donation Cards (Elevation 1). FAB (Elevation 6) fixed bottom right.
*   **Emotional Goal:** Abundance and discovery.

### 2. Item Details
*   **Layout:** Edge-to-edge Hero Image Carousel -> Title & Tags -> Donor Trust Card -> Description -> Sticky Bottom Action Bar.
*   **Visual Hierarchy:** Hero Image > "Request" CTA > Donor Trust.
*   **Emotional Goal:** Desire and safety (via the Trust Card).

### 3. Request Item (Bottom Sheet)
*   **Layout:** Drag handle -> Title ("Request Item") -> Donor Avatar -> Text Area ("Why do you need this?") -> Sticky Submit Button.
*   **Focus Area:** The Text Area. It is the heart of the interaction.

### 4. Community (Gratitude Wall)
*   **Layout:** Segmented Control (Wall | Leaders | Impact) -> Vertical Feed of ThankU Cards.
*   **Component Usage:** ThankU Card (Uses Gratitude Gold `#FFD166` accents, Quote marks).
*   **Emotional Goal:** Inspiration and warmth. 

### 5. Pickup Coordination (Message Overlay)
*   **Layout:** Donor View: 7-Day horizontal calendar strip -> List of 3 selectable time blocks -> "Send Times" Button. 
*   **Content Density:** Extremely low. Huge touch targets for time blocks.
*   **Emotional Goal:** Relief (No typing required).

### 6. Profile / Impact Dashboard
*   **Layout:** Avatar & Trust Level -> Large Impact Number (`124 kg Saved`) -> Bar Chart -> My Listings.
*   **Visual Hierarchy:** The Impact Number is Display Typography (48px).

---

## 10. Illustration System

**Direction:** "Soft Humanity."
*   **Style:** Flat vector, but with subtle, soft-edged gradients. No harsh black outlines (Corporate Memphis is banned). 
*   **Character Design:** Proportional human figures. Faces should not be highly detailed to allow anyone to project themselves onto the characters. 
*   **Scene Composition:** Always show interaction. E.g., Two people carrying a box together; a person planting a tree; a person waving holding a lamp.
*   **Colors:** Heavily utilize Kindness Coral (`#FFB4A2`) and Gratitude Gold (`#FFD166`) alongside the Primary Cyan.

---

## 11. Iconography System

**Library Recommendation:** **Lucide Icons** or **Phosphor Icons**.
*   **Style:** Unapologetically clean, geometric.
*   **Stroke Width:** 2px consistent stroke.
*   **Filled vs Outline:** Outline for default/inactive states. Filled for active/selected states (e.g., Bottom Tab Bar).
*   **Animation Potential:** Icons should be SVG-based to allow for micro-interactions (e.g., the Heart icon scaling up and bursting slightly when tapped).

---

## 12. Data Visualization System

Data must not look like a B2B SaaS dashboard. It must look like a fitness or wellness app.

*   **Impact Dashboard Chart:** Smooth bezier curves (no sharp line charts). The area under the curve is filled with a `#5ED6E3` to `#FFFFFF` vertical gradient.
*   **Metric Cards:** Square cards, `Radius-lg`, containing an icon, a large Display number, and a sub-label ("Trees Saved").
*   **Progress Components:** Circular progress rings (SVG) around the user's avatar to show progress to the next "Community Tier".

---

## 13. Design Tokens (JSON Structure for React Native)

```json
{
  "colors": {
    "primary": "#5ED6E3",
    "secondary": "#A8EEF4",
    "accent": "#00B8D4",
    "background": "#F6FEFF",
    "surface": "#FFFFFF",
    "text": {
      "primary": "#111827",
      "secondary": "#6B7280",
      "disabled": "#9CA3AF"
    },
    "border": "#E6F7FA",
    "success": "#2ECC71",
    "gold": "#FFD166",
    "coral": "#FFB4A2"
  },
  "spacing": {
    "micro": 4,
    "tiny": 8,
    "small": 16,
    "medium": 24,
    "large": 32,
    "xl": 48
  },
  "radius": {
    "xs": 4,
    "sm": 8,
    "md": 16,
    "lg": 24,
    "xl": 32,
    "full": 9999
  },
  "typography": {
    "fontFamily": "PlusJakartaSans-Regular",
    "fontFamilyBold": "PlusJakartaSans-Bold",
    "sizes": {
      "caption": 12,
      "body": 16,
      "h3": 18,
      "h2": 24,
      "h1": 32,
      "display": 48
    }
  }
}
```

---

## 14. Accessibility Framework

*   **WCAG Compliance:** Target WCAG 2.1 AA.
*   **Contrast Rules:** All text must meet a 4.5:1 contrast ratio against its background. The `#5ED6E3` primary color with white text fails this test—therefore, primary buttons must use `#111827` (Dark Slate) text for accessibility, or the button background must be darkened to `#009EBA`.
*   **Touch Targets:** Absolute minimum of 44x44px for any interactive element.
*   **Screen Reader Support:** All icons without text labels MUST have `accessibilityLabel` props.
*   **Motion Sensitivity:** Respect `Reduce Motion` OS settings by replacing spring animations with simple cross-fades.

---

## 15. Premium Design Heuristics

What makes ThankU feel like a $1B Apple-grade app?
1.  **Ruthless Whitespace:** Not filling every pixel. If a screen has only two elements, center them beautifully. Do not stretch them to fill space.
2.  **Typography as UI:** Using Font Weight and Size to create hierarchy, rather than drawing lines or boxes around everything.
3.  **Delightful Micro-interactions:** The haptic feedback when scrolling past the 10th item. The way the bottom sheet perfectly tracks the user's thumb velocity.
4.  **No Loading Spinners:** Use skeleton screens that map exactly to the layout of the loaded content. It feels twice as fast.
5.  **Contextual Keyboards:** When asking for a phone number, the OS number-pad must open automatically. Do not force the user to tap to bring up the keyboard.

---

## 16. Anti-Patterns (NEVER DO THIS)

*   **The "Amazon" Pattern:** Cramming 15 filters, 3 banners, and a dense navigation bar onto a single mobile screen.
*   **The "Casino" Gamification:** Spinning wheels, daily login bonuses, or generic gold coins. Status must be earned through altruism, not app-opens.
*   **The "Red Warning" Overload:** Using bright red for every alert. Reserve red ONLY for destructive actions (Delete Account). Use amber or calm blue for general alerts.
*   **Orphaned Dropdowns:** Using native OS dropdown pickers for core flows. Build custom bottom-sheet selectors to maintain brand immersion.
*   **Stroked Avatars:** Putting harsh 1px borders around profile pictures. Use soft drop shadows or let them sit flush against the background.

---

**FINAL DESIGN MANDATE:**
Every screen designed in Figma and coded in React Native must be checked against this document. If a component feels cluttered, dense, or stressful, it is failing the Spatial Design System. *Breathe. Add padding. Simplify.*
