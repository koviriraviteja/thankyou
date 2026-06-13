/**
 * ThankU — Safety & Guidelines Screen
 *
 * Matches Reference Image: Screen 21
 * Features: Safety principles list with icons and descriptions.
 */

import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { spacing } from '../src/theme/spacing';
import { radius } from '../src/theme/radius';
import { shadows } from '../src/theme/shadows';

const GUIDELINES = [
  {
    id: '1',
    icon: 'heart-outline',
    title: 'Be Respectful',
    body: 'Treat everyone with kindness and respect. Our community thrives on mutual trust and goodwill.',
  },
  {
    id: '2',
    icon: 'shield-checkmark-outline',
    title: 'Meet Safely',
    body: 'Meet in public places and follow safety tips. Bring someone with you for heavy items.',
  },
  {
    id: '3',
    icon: 'person-circle-outline',
    title: 'Verify Users',
    body: 'We verify donors and members for your safety. Check verification badges before pickup.',
  },
  {
    id: '4',
    icon: 'close-circle-outline',
    title: 'No Commercial Use',
    body: 'ThankU is for genuine donations, not for selling. Keep our community pure and purposeful.',
  },
  {
    id: '5',
    icon: 'camera-outline',
    title: 'Honest Descriptions',
    body: 'Always describe items accurately and include clear photos. Transparency builds trust.',
  },
  {
    id: '6',
    icon: 'time-outline',
    title: 'Be Timely',
    body: 'Respect scheduled pickup times. If you can\'t make it, communicate and reschedule.',
  },
];

export default function SafetyScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Safety & Guidelines</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Intro */}
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>We ensure a safe and trusted community</Text>
          <Text style={styles.introBody}>
            Following these guidelines helps keep ThankU a positive space for everyone.
          </Text>
        </View>

        {/* Guidelines */}
        <View style={styles.guidelinesContainer}>
          {GUIDELINES.map((item) => (
            <View key={item.id} style={styles.guidelineCard}>
              <View style={styles.guidelineIcon}>
                <Ionicons name={item.icon as any} size={28} color={colors.primary} />
              </View>
              <View style={styles.guidelineContent}>
                <Text style={styles.guidelineTitle}>{item.title}</Text>
                <Text style={styles.guidelineBody}>{item.body}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footerCard}>
          <Image 
            source={require('../assets/images/safety-shield.png')} 
            style={{ width: 120, height: 120, marginBottom: spacing.medium }} 
            contentFit="contain" 
          />
          <Text style={styles.footerTitle}>Safety is our priority.</Text>
          <Text style={styles.footerBody}>Together, we build trust.</Text>
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.medium, paddingVertical: spacing.small, backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  introSection: {
    paddingHorizontal: spacing.medium, paddingVertical: spacing.large, backgroundColor: colors.surface,
  },
  introTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.tiny },
  introBody: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },
  guidelinesContainer: {
    paddingHorizontal: spacing.medium, paddingTop: spacing.medium, gap: spacing.small,
  },
  guidelineCard: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.medium, ...shadows.sm,
  },
  guidelineIcon: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.highlight,
    justifyContent: 'center', alignItems: 'center', marginRight: spacing.medium,
  },
  guidelineContent: { flex: 1 },
  guidelineTitle: { ...typography.body, color: colors.textPrimary, fontWeight: '700', marginBottom: spacing.micro },
  guidelineBody: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20 },
  footerCard: {
    alignItems: 'center', marginHorizontal: spacing.medium, marginTop: spacing.large,
    padding: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.highlight,
  },
  footerIcon: { marginBottom: spacing.small },
  footerTitle: { ...typography.h3, color: colors.textPrimary },
  footerBody: { ...typography.body, color: colors.textSecondary, marginTop: 2 },
});
