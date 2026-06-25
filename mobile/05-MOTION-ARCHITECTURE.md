# [05-MOTION-ARCHITECTURE.md]

*Architected by the Principal Interaction & Engineering Council (Apple, Airbnb, Stripe, Linear, Vercel). This document defines the absolute physics, frontend orchestration, and React Native (Expo) architecture for ThankU. It serves as the definitive engineering manual.*

---

## 1. Motion Philosophy

### The Purpose of Motion
In ThankU, motion is a functional dimension of the UI. It is the connective tissue between user intent and system response. 

*   **Emotional Purpose:** To replace the anxiety of online transactions with the joy of human connection. A perfectly timed easing curve lowers cognitive load and induces calm.
*   **Functional Purpose:** Spatial orientation. Users must always know where they came from and how to get back. Elements must not teleport; they must travel.
*   **Trust Purpose:** Glitches, stutters, and unhandled loading states destroy trust. 60fps+ fluid motion proves to the user that the platform is robust, secure, and professionally maintained.
*   **Community Purpose:** To visually celebrate the network effect. The "Applaud" animation on the Gratitude Wall is the digital equivalent of a high-five.

---

## 2. Interaction Physics System (`react-native-reanimated` v3)

Linear animations are strictly banned. The UI operates on springs and friction to simulate physical mass.

### 2.1. Global Timing Constraints
*   **Micro-interactions (Toggles, Active States):** `150ms - 200ms`
*   **Component Transitions (Card Expansion):** `250ms - 300ms`
*   **Screen Transitions (Modals, Context Shifts):** `300ms - 400ms`

### 2.2. Standardized Spring Configurations
All components utilizing spring physics must pull from this centralized token set:

```javascript
// theme/physics.ts
import { withSpring } from 'react-native-reanimated';

export const springs = {
  // Use for standard UI elements (Cards, Buttons)
  natural: { mass: 1, damping: 20, stiffness: 200, overshootClamping: false },
  
  // Use for celebratory elements (Avatars, Gratitude Hearts, Badges)
  playful: { mass: 1, damping: 12, stiffness: 250, overshootClamping: false },
  
  // Use for heavy structural elements (Bottom Sheets, Drawers)
  heavy: { mass: 1.5, damping: 25, stiffness: 200, overshootClamping: true },
};

// Usage: width.value = withSpring(200, springs.natural);
```

### 2.3. Standardized Easing Configurations
When springs cannot be used (e.g., Opacity, Color Interpolation), use these exact Beziers.

```javascript
// theme/easing.ts
import { Easing } from 'react-native-reanimated';

export const easings = {
  // Standard UI fades
  swift: Easing.bezier(0.25, 1, 0.5, 1),
  // Dismissing modals, exiting screen
  exit: Easing.bezier(0.3, 0, 1, 1),
  // Hero images, initial mounts
  entrance: Easing.bezier(0, 0, 0.2, 1),
};
```

---

## 3. Navigation Motion System (Expo Router Configuration)

### 3.1. App Launch & Splash Transition
*   **Engine:** `expo-splash-screen`
*   **Sequence:** The API resolves the authentication state -> App tells Splash Screen to hide -> The primary cyan background scales down to reveal the Home Stack underneath using a `300ms` swift bezier.

### 3.2. Stack Transitions
*   **Configuration:** `screenOptions={{ animation: 'slide_from_right' }}` (iOS Native Feel).
*   **Android Parity:** Enforce the iOS-style horizontal slide on Android to maintain spatial consistency across the platform, rather than Android's default fade/scale.

### 3.3. Bottom Sheet Navigation
*   **Engine:** `@gorhom/bottom-sheet` (v4+)
*   **Physics:** Must support pan-gesture tracking. The velocity of the user's swipe down must transfer perfectly into the closing spring animation. `snapPoints={['50%', '90%']}`.

---

## 4. Scroll Choreography (`useAnimatedScrollHandler`)

### 4.1. Pull-to-Refresh (The "Giving Hands")
*   **Behavior:** The standard OS spinner is banned. Pulling down reveals a custom SVG of "Giving Hands." The further the pull (`negative Y-offset`), the more the hands open. On release, a soft starburst emits to signal data fetching.
*   **Implementation:** Custom `RefreshControl` tied to a Reanimated scroll handler.

### 4.2. The Home Feed (Dynamic Headers)
*   **Behavior:** As the user scrolls `scrollOffset.value > 50`, the large "Good Morning" greeting fades out (`opacity: 0`), and the Search Bar shrinks and pins to the top safe area.
*   **Implementation:** Must use Reanimated's `interpolate` function tied to the `contentOffset.y` of the `FlashList`.

### 4.2. Impact Dashboard (Parallax)
*   **Behavior:** The background gradient (`#5ED6E3` to `#F6FEFF`) moves at 50% the speed of the user's scroll to create depth.
*   **Data Vis:** The numbers (e.g., "124 kg Saved") do not populate until they intersect the viewport. They must roll up rapidly using `withTiming` over `800ms`.

---

## 5. Component Motion Library

### 5.1. Interactive Button (The Standard Press)
Every primary button must utilize Reanimated to handle press states to prevent React thread blockages.

```javascript
// Pseudo-architecture for PrimaryButton.tsx
const scale = useSharedValue(1);

const gesture = Gesture.Tap()
  .onBegin(() => { scale.value = withSpring(0.96, springs.natural); })
  .onFinalize(() => { scale.value = withSpring(1, springs.natural); });

return (
  <GestureDetector gesture={gesture}>
    <Animated.View style={{ transform: [{ scale }] }}>
      <Text>Donate Item</Text>
    </Animated.View>
  </GestureDetector>
);
```

### 5.2. Item Details (Shared Element Transition)
*   When tapping a card in the feed, the `expo-image` component must smoothly transition from the card's bounding box to the full-bleed hero position on the Details screen without re-rendering the image data. 

### 5.3. Profile Navigation (Avatar Morphing)
*   When tapping a user's avatar on a Gratitude Note, the avatar detaches from the note, scales up, and seamlessly morphs into the Hero Avatar of the User Profile screen to maintain spatial continuity.

### 5.4. List Reordering (LayoutAnimations)
*   **Mandate:** When a new ThankU note is added to the Gratitude Wall, the existing notes must gracefully slide down to make room. They must never "snap" into their new positions. Use Reanimated's `Layout` API (e.g., `layout={LinearTransition.springify()}`).

---

## 6. Haptic Feedback Orchestration (`react-native-haptic-feedback`)

Haptics are emotional anchors. They must be used deliberately.

| Interaction | Haptic Type | Purpose |
| :--- | :--- | :--- |
| Tapping Bottom Tabs | `selection` | Confirming physical contact (Micro). |
| Pull-to-Refresh Release | `impactLight` | Mechanical feedback of a "snap" mechanism. |
| Submitting a Request | `impactMedium` | Weighting the decision. |
| **Pickup Completed** | `notificationSuccess` | **The Climax.** A heavy double-pulse triggering dopamine. |
| Form Validation Error | `notificationWarning` | Gentle interruption of flow. |

---

## 7. React Native Frontend Architecture

### 7.1. Technology Stack
*   **Framework:** Expo (Managed Workflow - SDK 50+).
*   **Routing:** Expo Router v3 (File-based, Deep-link ready).
*   **Performance Lists:** `@shopify/flash-list`.
*   **Animations:** `react-native-reanimated` v3 + `react-native-gesture-handler`.
*   **State (Global):** `zustand` (Lightweight, fast).
*   **State (Server):** `@tanstack/react-query` (Caching, optimistic updates).
*   **Storage (Offline/Cache):** `react-native-mmkv` (Synchronous C++ storage, 30x faster than AsyncStorage).
*   **Styling:** `NativeWind` (TailwindCSS for React Native).

### 7.2. Strict Directory Structure
```text
/src
  /app                  # Expo Router filesystem
    /(tabs)             # Bottom navigation routes
    /(auth)             # Authentication flows
    /modals             # Full-screen overlays
  /components
    /ui                 # Atomic (Buttons, Inputs, Badges) - MUST NOT have side effects
    /features           # Smart (DonationFeed, ImpactChart) - Connects to stores
    /layout             # SafeAreaWrappers, KeyboardAvoidingViews
  /store                # Zustand (useAuthStore, useUserStore)
  /services             # API Clients (Supabase, Firebase, REST)
  /hooks                # React Query hooks (useItems, useRequests)
  /theme                # Design tokens (colors.ts, typography.ts, physics.ts)
  /utils                # Pure functions (formatDate, calculateDistance)
  /assets               # Fonts, local SVGs, Lottie JSON
```

---

## 8. State Management Strategy

### 8.1. Server State (`React Query`)
*   **Mandate:** All API interactions must flow through React Query. `useEffect` is banned for data fetching.
*   **Optimistic Updates:** If a user taps "Applaud" on a Gratitude Note, the UI must update instantly via `queryClient.setQueryData`, followed by the background API mutation. If the API fails, it rolls back.

### 8.2. Global State (`Zustand`)
*   **Mandate:** Redux is banned due to boilerplate and performance overhead. Use Zustand for transient global UI state (e.g., `isDrawerOpen`, `themePreference`, `hasSeenOnboarding`).

### 8.3. Offline State (`MMKV`)
*   **Mandate:** The Home Feed JSON payload must be cached in MMKV. When the app cold-boots, it loads the cached data instantly (0ms network wait) while React Query silently refetches fresh data in the background.

---

## 9. Performance Architecture (The 60FPS Mandate)

A premium app drops exactly zero frames. 

1.  **List Virtualization:** `ScrollView` and `FlatList` are banned for feeds. **Only `FlashList` by Shopify is permitted.** You must explicitly provide the `estimatedItemSize` prop to prevent layout thrashing.
2.  **Image Rendering:** `react-native`'s default `<Image>` is banned. **Only `expo-image` is permitted.** It utilizes native memory caching and WebP support.
3.  **Loading States:** Blank screens with spinners are banned. Use `expo-image`'s built-in `blurhash` to load a beautiful blurred placeholder before the high-res image resolves.
4.  **JS Thread Protection:** Heavy mathematical calculations (e.g., sorting items by GPS distance) must happen either on the backend, via an Expo Background Task, or memoized via `useMemo`.

---

## 10. Strict Engineering Guardrails (DOs and DONTs)

### What Engineering MUST ALWAYS DO:
1.  **Respect Safe Areas:** Always use `useSafeAreaInsets()` from `react-native-safe-area-context`. Never hardcode `paddingTop: 50`. The UI must flawlessly adapt to the Dynamic Island and Android notches.
2.  **Handle Keyboards:** Every screen with an input must use `KeyboardAvoidingView` or `react-native-keyboard-controller`. The keyboard must never obscure a text input or the "Submit" button.
3.  **Graceful Degradation:** Use React Error Boundaries. If a component fails to render, the app must not crash. It must show a friendly fallback UI ("We hit a snag loading this piece.").
4.  **Type Everything:** TypeScript `strict` mode is enabled. The `any` type is completely banned.

### What Engineering MUST NEVER DO:
1.  **Never Use Inline Functions in Lists:** `onPress={() => handlePress(item.id)}` inside a FlashList item causes massive re-render performance drops. Always extract to a memoized function or pass the ID down properly.
2.  **Never Use the Animated API:** The base `Animated` API from React Native is banned. All animations must use `react-native-reanimated` to execute on the UI thread, bypassing the JS bridge entirely.
3.  **Never Use Native Dropdowns:** OS-default `<Picker>` or Select components look cheap and break immersion. Always build custom Bottom Sheet selectors for forms.

---

**FINAL ARCHITECTURE MANDATE:**
ThankU must not feel like a "cross-platform app." It must feel indistinguishable from a natively coded Swift/Kotlin application. Performance, motion, and offline capabilities are not afterthoughts; they are the primary features of the platform's trust architecture.
