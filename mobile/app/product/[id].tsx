/**
 * ThankU — Product / Item Details Screen
 *
 * Matches Reference Image: Screen 11 (Request Item)
 * Features: Image carousel, donor card with verification,
 * condition badge, "Request Item" flow, share, favorite.
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, Image, ScrollView, TouchableOpacity,
  ActivityIndicator, Share, Dimensions, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { shadows } from '../../src/theme/shadows';
import { Button } from '../../src/components/ui/Button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProductDetailsScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (id) fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setProduct(data);
      if (user) {
        const { data: favData } = await supabase
          .from('favorites')
          .select('*')
          .match({ user_id: user.id, product_id: id })
          .maybeSingle();
        if (favData) setIsFavorite(true);
      }
    }
    setLoading(false);
  };

  const startChat = async () => {
    if (!user) { alert('Please sign in to chat.'); return; }
    if (user.id === product.seller_id) { alert('This is your own item.'); return; }
    try {
      const { data: existing } = await supabase
        .from('chats')
        .select('*')
        .eq('product_id', product.id)
        .eq('buyer_id', user.id);

      let chatId;
      if (existing && existing.length > 0) {
        chatId = existing[0].id;
      } else {
        const { data: newChat, error } = await supabase
          .from('chats')
          .insert({ product_id: product.id, buyer_id: user.id, seller_id: product.seller_id })
          .select()
          .single();
        if (error) throw error;
        chatId = newChat.id;
      }
      router.push({
        pathname: '/chat/[id]',
        params: { id: chatId, productTitle: product.title, otherUser: 'Donor', productImage: product.image_url },
      });
    } catch (err) {
      console.error('Chat error:', err);
      alert('Could not start chat.');
    }
  };

  const toggleFavorite = async () => {
    if (!user) { alert('Please sign in.'); return; }
    const newStatus = !isFavorite;
    setIsFavorite(newStatus);
    if (newStatus) {
      await supabase.from('favorites').insert({ user_id: user.id, product_id: id });
    } else {
      await supabase.from('favorites').delete().match({ user_id: user.id, product_id: id });
    }
  };

  const handleShare = async () => {
    if (!product) return;
    try {
      await Share.share({ message: `Check out this free item on ThankU: ${product.title}!` });
    } catch {}
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textDisabled} />
        <Text style={styles.notFoundText}>Item not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.goBackBtn}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const allImages = product.image_urls?.length > 0 ? product.image_urls : [product.image_url];
  const dateStr = new Date(product.created_at).toLocaleDateString();

  return (
    <View style={styles.container}>
      {/* Floating Header */}
      <SafeAreaView style={styles.floatingHeader} edges={['top']}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn} onPress={handleShare}>
            <Ionicons name="share-outline" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={toggleFavorite}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? colors.coral : colors.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.imageCarousel}>
          <FlatList
            data={allImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => i.toString()}
            onMomentumScrollEnd={(e) => {
              setActiveImageIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH));
            }}
            renderItem={({ item: uri }) => (
              <Image source={{ uri }} style={styles.carouselImage} />
            )}
          />
          {/* Page Indicator */}
          {allImages.length > 1 && (
            <View style={styles.pageIndicator}>
              <Text style={styles.pageIndicatorText}>
                {activeImageIndex + 1} / {allImages.length}
              </Text>
            </View>
          )}
        </View>

        {/* Title & Info */}
        <View style={styles.detailsCard}>
          <View style={styles.titleRow}>
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>FREE</Text>
            </View>
            {product.condition && (
              <View style={styles.conditionBadge}>
                <Text style={styles.conditionText}>{product.condition}</Text>
              </View>
            )}
          </View>
          <Text style={styles.itemTitle}>{product.title}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color={colors.primary} />
            <Text style={styles.locationText}>{product.location}</Text>
            <Text style={styles.dateText}>• {dateStr}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About this item</Text>
          <Text style={styles.descriptionText}>
            {product.description || 'No description provided by the donor.'}
          </Text>
        </View>

        {/* Donor Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Donor</Text>
          <TouchableOpacity style={styles.donorRow}>
            <View style={styles.donorAvatar}>
              <Ionicons name="person" size={24} color={colors.surface} />
            </View>
            <View style={styles.donorInfo}>
              <View style={styles.donorNameRow}>
                <Text style={styles.donorName}>Verified Donor</Text>
                <Ionicons name="shield-checkmark" size={16} color={colors.success} style={{ marginLeft: 4 }} />
              </View>
              <View style={styles.donorStars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Ionicons key={i} name="star" size={12} color={colors.gold} />
                ))}
                <Text style={styles.donorRating}>4.8</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
          </TouchableOpacity>
        </View>

        {/* Safety Notice */}
        <View style={styles.safetyCard}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
          <Text style={styles.safetyText}>
            Always meet in public places. Check the item before accepting.
          </Text>
        </View>

        {/* Spacer for Bottom Bar */}
        <View style={{ height: 180 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.chatSmallBtn} onPress={startChat}>
          <Ionicons name="chatbubble-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Button
            title="Request Item"
            onPress={startChat}
            icon={<Ionicons name="hand-left-outline" size={20} color={colors.textOnPrimary} />}
          />
        </View>
      </View>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    ...typography.h3,
    color: colors.textSecondary,
    marginTop: spacing.medium,
  },
  goBackBtn: {
    marginTop: spacing.medium,
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.small,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  goBackText: {
    ...typography.label,
    color: colors.textOnPrimary,
  },

  // ─── Floating Header ─────────────────────────────
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.medium,
    paddingBottom: spacing.tiny,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  headerRight: {
    flexDirection: 'row',
    gap: spacing.tiny,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },

  // ─── Image Carousel ──────────────────────────────
  imageCarousel: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.85,
    backgroundColor: colors.highlight,
    position: 'relative',
  },
  carouselImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.85,
    resizeMode: 'cover',
  },
  pageIndicator: {
    position: 'absolute',
    bottom: spacing.medium,
    right: spacing.medium,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.micro,
    borderRadius: radius.full,
  },
  pageIndicatorText: {
    ...typography.caption,
    color: colors.surface,
    fontWeight: '700',
  },

  // ─── Details ─────────────────────────────────────
  detailsCard: {
    backgroundColor: colors.surface,
    padding: spacing.medium,
    marginBottom: spacing.tiny,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.tiny,
    marginBottom: spacing.tiny,
  },
  freeBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.micro,
    borderRadius: radius.full,
  },
  freeBadgeText: {
    ...typography.caption,
    color: colors.surface,
    fontWeight: '800',
    letterSpacing: 1,
  },
  conditionBadge: {
    backgroundColor: colors.highlight,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.micro,
    borderRadius: radius.full,
  },
  conditionText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  itemTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.tiny,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  dateText: {
    ...typography.bodySmall,
    color: colors.textDisabled,
  },

  // ─── Section Cards ───────────────────────────────
  sectionCard: {
    backgroundColor: colors.surface,
    padding: spacing.medium,
    marginBottom: spacing.tiny,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.small,
  },
  descriptionText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    textAlign: 'left',
    flexWrap: 'wrap',
  },

  // ─── Donor ───────────────────────────────────────
  donorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  donorAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.small,
  },
  donorInfo: {
    flex: 1,
  },
  donorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  donorName: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  donorStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    marginTop: 2,
  },
  donorRating: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 4,
  },

  // ─── Safety ──────────────────────────────────────
  safetyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    marginHorizontal: spacing.medium,
    marginTop: spacing.small,
    padding: spacing.medium,
    borderRadius: radius.lg,
    gap: spacing.small,
  },
  safetyText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },

  // ─── Bottom Bar ──────────────────────────────────
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.medium,
    paddingBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.small,
    ...shadows.sheet,
  },
  chatSmallBtn: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
