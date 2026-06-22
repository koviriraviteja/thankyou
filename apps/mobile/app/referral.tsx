import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView, Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import { typography } from '../src/theme/typography';
import { spacing } from '../src/theme/spacing';
import { radius } from '../src/theme/radius';
import { shadows } from '../src/theme/shadows';
import { Button } from '../src/components/ui/Button';
import { useAuth } from '../src/context/AuthContext';

export default function ReferralScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { user } = useAuth();
  
  // In a real app, this would be a unique code from the user's profile
  const referralCode = user ? `THNKU-${user.id?.substring(0, 5).toUpperCase() || '12345'}` : 'THNKU-12345';
  const referralLink = `https://thanku.app/invite/${referralCode}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join ThankU, the community sharing app! Use my invite code ${referralCode} to get started: ${referralLink}`,
        title: 'Join ThankU',
        url: referralLink, // iOS only
      });
    } catch (error: any) {
      console.error('Error sharing referral link:', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Invite Friends</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.heroSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="people" size={60} color={colors.primary} />
          </View>
          <Text style={styles.heroTitle}>Share the Love</Text>
          <Text style={styles.heroSubtitle}>
            Invite your friends to ThankU and earn community points. Together, we can make a bigger impact!
          </Text>
        </View>

        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Your Personal Invite Code</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{referralCode}</Text>
          </View>
          <Text style={styles.codeHint}>
            Share this code directly or use the link below.
          </Text>
        </View>

        <View style={styles.actionContainer}>
          <Button 
            title="Share Invite Link" 
            onPress={handleShare}
            style={styles.shareButton}
          />
        </View>

        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>How it works</Text>
          
          <View style={styles.stepRow}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Share your link</Text>
              <Text style={styles.stepDescription}>Send your unique invite link or code to your friends.</Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Friends sign up</Text>
              <Text style={styles.stepDescription}>They create an account and verify their profile.</Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Earn rewards</Text>
              <Text style={styles.stepDescription}>Both you and your friend earn 50 community points!</Text>
            </View>
          </View>
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: spacing.medium, 
    paddingVertical: spacing.small,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: { 
    ...typography.h3, 
    color: colors.textPrimary,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.large,
    paddingTop: spacing.xl,
    paddingBottom: spacing.large,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.large,
  },
  heroTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.small,
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  codeCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.medium,
    padding: spacing.large,
    borderRadius: radius.xl,
    alignItems: 'center',
    ...shadows.md,
  },
  codeLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: spacing.medium,
  },
  codeBox: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.medium,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginBottom: spacing.medium,
    width: '100%',
    alignItems: 'center',
  },
  codeText: {
    ...typography.h2,
    color: colors.primary,
    letterSpacing: 2,
  },
  codeHint: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actionContainer: {
    paddingHorizontal: spacing.medium,
    marginTop: spacing.xl,
    marginBottom: spacing.large,
  },
  shareButton: {
    width: '100%',
  },
  howItWorksSection: {
    paddingHorizontal: spacing.large,
    marginTop: spacing.medium,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.medium,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: spacing.medium,
    alignItems: 'flex-start',
  },
  stepNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.medium,
    marginTop: 2,
  },
  stepNumberText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  stepDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
