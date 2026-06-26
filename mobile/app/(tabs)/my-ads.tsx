/**
 * ThankU — My Donations / Giving Screen
 *
 * Matches Reference Image: Screen 16 (Donation Tracking)
 * Features: Donation timeline tracker, status badges,
 * DONATIONS / FAVORITES tabs, mark as donated.
 */

import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, FlatList, Image,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { shadows } from '../../src/theme/shadows';
import { EmptyState } from '../../src/components/ui/EmptyState';

type ActiveTab = 'DONATIONS' | 'FAVORITES';

export default function MyAdsScreen() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('DONATIONS');
  const [myAds, setMyAds] = useState<any[]>([]);
  const [favoriteAds, setFavoriteAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      if (user) fetchMyAds();
      else setLoading(false);
    }, [user])
  );

  const fetchMyAds = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', user?.id)
      .order('created_at', { ascending: false });
    if (data) setMyAds(data);

    const { data: favData } = await supabase
      .from('favorites')
      .select('product:product_id(*)')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    if (favData) setFavoriteAds(favData.map(f => f.product).filter(Boolean));
    setLoading(false);
  };

  const markAsDonated = async (productId: string) => {
    Alert.alert(
      'Mark as Donated? 🎉',
      'This will mark the item as successfully given away.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            await supabase.from('products').update({ is_sold: true }).eq('id', productId);
            fetchMyAds();
          },
        },
      ]
    );
  };

  const confirmDelete = (productId: string) => {
    Alert.alert(
      'Delete Donation',
      'Are you sure? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await supabase.from('favorites').delete().eq('product_id', productId);
            await supabase.from('products').delete().eq('id', productId);
            fetchMyAds();
          },
        },
      ]
    );
  };

  const removeFavorite = async (productId: string) => {
    await supabase.from('favorites').delete().match({ user_id: user?.id, product_id: productId });
    fetchMyAds();
  };

  const getStatusConfig = (item: any) => {
    if (item.is_sold) return { label: 'Donated 🎉', color: colors.success, bg: '#ECFDF5' };
    return { label: 'Active', color: colors.primary, bg: colors.highlight };
  };

  const renderDonation = ({ item }: { item: any }) => {
    const status = getStatusConfig(item);
    const timeStr = new Date(item.created_at).toLocaleDateString();

    return (
      <View style={styles.donationCard}>
        <View style={styles.cardRow}>
          <Image source={{ uri: item.image_url }} style={styles.cardImage} />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
            <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
              <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
            </View>
            <View style={styles.cardMeta}>
              <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.cardMetaText}>{item.location?.split(',')[0]}</Text>
              <Text style={styles.cardMetaText}>• {timeStr}</Text>
            </View>
          </View>
        </View>

        {/* Action Row */}
        <View style={styles.actionRow}>
          {!item.is_sold && (
            <>
              <TouchableOpacity
                style={styles.actionBtnPrimary}
                onPress={() => markAsDonated(item.id)}
              >
                <Ionicons name="checkmark-circle-outline" size={16} color={colors.surface} />
                <Text style={styles.actionBtnPrimaryText}>Mark Donated</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtnGhost}
                onPress={() => router.push({ pathname: '/edit-ad', params: { id: item.id } })}
              >
                <Text style={styles.actionBtnGhostText}>Edit</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            style={styles.actionBtnDanger}
            onPress={() => confirmDelete(item.id)}
          >
            <Ionicons name="trash-outline" size={14} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFavorite = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.donationCard}
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
    >
      <View style={styles.cardRow}>
        <Image source={{ uri: item.image_url }} style={styles.cardImage} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.location}</Text>
        </View>
        <TouchableOpacity style={styles.favBtn} onPress={() => removeFavorite(item.id)}>
          <Ionicons name="heart" size={22} color={colors.coral} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Giving</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {(['DONATIONS', 'FAVORITES'] as ActiveTab[]).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'DONATIONS' ? 'My Donations' : 'Saved Items'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : activeTab === 'DONATIONS' ? (
        <FlatList
          data={myAds}
          keyExtractor={item => item.id}
          renderItem={renderDonation}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              imageSource={require('../../assets/images/givings_empty.png')}
              title="No donations yet"
              body="You haven't posted any items yet. Start sharing and make someone's day!"
              ctaTitle="Donate Your First Item"
              onCtaPress={() => router.push('/(tabs)/post')}
            />
          }
        />
      ) : (
        <FlatList
          data={favoriteAds}
          keyExtractor={item => item.id}
          renderItem={renderFavorite}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              imageSource={require('../../assets/images/givings_empty.png')}
              title="No saved items"
              body="Items you love will appear here. Start exploring!"
              ctaTitle="Explore Items"
              onCtaPress={() => router.push('/(tabs)/')}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ─── Header ──────────────────────────────────────
  header: {
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.medium,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },

  // ─── Tabs ────────────────────────────────────────
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.small,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },

  // ─── Cards ───────────────────────────────────────
  listContent: {
    padding: spacing.medium,
    gap: spacing.small,
  },
  donationCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.medium,
    ...shadows.sm,
  },
  cardRow: {
    flexDirection: 'row',
  },
  cardImage: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colors.highlight,
    marginRight: spacing.small,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.micro,
  },
  cardSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.tiny,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginBottom: spacing.micro,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '700',
    fontSize: 10,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardMetaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  favBtn: {
    padding: spacing.micro,
    justifyContent: 'center',
  },

  // ─── Actions ─────────────────────────────────────
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.small,
    paddingTop: spacing.small,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    gap: spacing.tiny,
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.tiny,
    borderRadius: radius.sm,
    gap: 4,
  },
  actionBtnPrimaryText: {
    ...typography.caption,
    color: colors.surface,
    fontWeight: '700',
  },
  actionBtnGhost: {
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.tiny,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionBtnGhostText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  actionBtnDanger: {
    marginLeft: 'auto',
    padding: spacing.tiny,
  },
});
