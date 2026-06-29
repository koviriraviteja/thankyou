/**
 * ThankU — Onboarding Splash Screens
 * 4 full-screen slides + logo header
 * Last slide → "Get Started" → Phone Login
 */

import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image,
  Dimensions, FlatList, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  icon: string;
  bg: string;
  accent: string;
};

const SLIDES: Slide[] = [
  {
    id: '1',
    title: 'ONE MISSION.\nSAME PROMISE.',
    subtitle: 'Welcome to ThankU',
    body: 'Your brand new platform for sharing freely and helping genuinely in your local community.',
    icon: 'heart',
    bg: '#FFF5F5',
    accent: '#FF3B30',
  },
  {
    id: '2',
    title: 'SHARE\nFREELY',
    subtitle: 'How it works',
    body: 'Post items you no longer need and let them find a loving new home instead of a landfill.',
    icon: 'gift-outline',
    bg: '#FFFBF0',
    accent: '#FEBA35',
  },
  {
    id: '3',
    title: 'CONNECT\nLOCALLY',
    subtitle: 'Our community',
    body: 'Chat securely with interested neighbors nearby and arrange a safe pickup.',
    icon: 'people-outline',
    bg: '#F0F5FF',
    accent: '#4BC6D3',
  },
  {
    id: '4',
    title: 'REUSE &\nRECYCLE',
    subtitle: "Ready to start?",
    body: 'Give every item a second life. Make a real difference — one share at a time.',
    icon: 'leaf-outline',
    bg: '#F0FFF5',
    accent: '#34C759',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);

  const markSeenAndGo = async (path: string) => {
    await AsyncStorage.setItem('thanku_onboarding_seen', 'true');
    router.push(path as any);
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      markSeenAndGo('/(auth)/phone');
    }
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    if (idx !== currentIndex) setCurrentIndex(idx);
  };

  const isLast = currentIndex === SLIDES.length - 1;
  const accent = SLIDES[currentIndex].accent;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      {/* Full-screen swipeable slides */}
      <FlatList<Slide>
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.slide, { backgroundColor: item.bg }]}>
            {/* Big icon circle */}
            <View style={[styles.iconCircle, { backgroundColor: item.accent }]}>
              <Ionicons name={item.icon as any} size={88} color="#FFFFFF" />
            </View>

            <Text style={[styles.slideLabel, { color: item.accent }]}>
              {item.subtitle.toUpperCase()}
            </Text>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideBody}>{item.body}</Text>
          </View>
        )}
      />

      {/* Bottom controls */}
      <View style={styles.bottomBar}>
        {/* Dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === currentIndex ? accent : '#E0E0E0' },
                i === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* CTA button */}
        <TouchableOpacity onPress={handleNext} activeOpacity={0.85}>
          <LinearGradient
            colors={isLast ? ['#4BC6D3', '#FEBA35'] : [accent, accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaBtn}
          >
            <Text style={styles.ctaText}>
              {isLast ? 'Get Started 🚀' : 'Next'}
            </Text>
            {!isLast && (
              <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ marginLeft: 6 }} />
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Skip button at bottom */}
        <TouchableOpacity onPress={() => markSeenAndGo('/(tabs)')} style={styles.skipBtn}>
          <Text style={[styles.skipText, { color: accent }]}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  iconCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  slideLabel: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2.5,
    marginBottom: 10,
  },
  slideTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1C1C1E',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 20,
  },
  slideBody: {
    fontSize: 16,
    color: '#6E6E6E',
    textAlign: 'center',
    lineHeight: 26,
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    width: 8,
  },
  dotActive: {
    width: 24,
  },
  ctaBtn: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
