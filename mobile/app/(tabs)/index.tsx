/**
 * ThankU — Home Feed Screen
 *
 * Matches Reference Image: Screen 13 (Search & Discovery)
 * Features: Greeting header, search bar, trending donations,
 * category grid, filter pills, donation feed.
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, FlatList, TextInput, ScrollView,
  TouchableOpacity, Image, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import * as Location from 'expo-location';
import { useAuth } from '../../src/context/AuthContext';
import { useNotification } from '../../src/context/NotificationContext';
import { useTheme } from '../../src/context/ThemeContext';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { shadows } from '../../src/theme/shadows';
import { DonationCard } from '../../src/components/ui/Card';
import { EmptyState } from '../../src/components/ui/EmptyState';

const CATEGORIES = [
  { id: '1', name: 'Furniture', icon: 'bed-outline' },
  { id: '2', name: 'Electronics', icon: 'tv-outline' },
  { id: '3', name: 'Books', icon: 'book-outline' },
  { id: '4', name: 'Clothing', icon: 'shirt-outline' },
  { id: '5', name: 'Toys', icon: 'happy-outline' },
  { id: '6', name: 'Kitchen', icon: 'restaurant-outline' },
  { id: '7', name: 'Sports', icon: 'football-outline' },
  { id: '8', name: 'Medical', icon: 'medkit-outline' },
  { id: '9', name: 'Nature/Plants', icon: 'leaf-outline' },
  { id: '10', name: 'Food', icon: 'nutrition-outline' },
  { id: '11', name: 'Miscellaneous', icon: 'cube-outline' },
];

const DISTANCE_FILTERS = ['1 km', '5 km', '10 km', '20 km'];
const CONDITION_FILTERS = ['All', 'New', 'Like New', 'Good', 'Used'];

export default function HomeFeedScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locationName, setLocationName] = useState('Fetching location...');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDistance, setSelectedDistance] = useState('5 km');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { notifications } = useNotification();
  const params = useLocalSearchParams();

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  useEffect(() => {
    if (params.newLocation) {
      setLocationName(params.newLocation as string);
      router.setParams({ newLocation: '' });
    }
    if (params.category) {
      setSelectedCategory(params.category as string);
      router.setParams({ category: '' });
    }
  }, [params.newLocation, params.category]);

  const fetchCurrentLocation = async () => {
    setLocationName('Fetching location...');
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocationName('Location Access Denied');
      return;
    }
    try {
      let loc = await Location.getCurrentPositionAsync({});
      let geocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (geocode.length > 0) {
        const { district, city, region, country, name } = geocode[0];
        const preciseLocation = district || city || region || name;
        setLocationName(`${preciseLocation}, ${country}`);
      } else {
        setLocationName('Unknown Location');
      }
    } catch {
      setLocationName('Location Error');
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    const { data } = await supabase.from('favorites').select('product_id').eq('user_id', user.id);
    if (data) setFavorites(new Set(data.map(f => f.product_id)));
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) return;
    const isFav = favorites.has(productId);
    const newFavs = new Set(favorites);
    if (isFav) {
      newFavs.delete(productId);
      setFavorites(newFavs);
      await supabase.from('favorites').delete().match({ user_id: user.id, product_id: productId });
    } else {
      newFavs.add(productId);
      setFavorites(newFavs);
      await supabase.from('favorites').insert({ user_id: user.id, product_id: productId });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProducts();
      if (user) fetchFavorites();
    }, [selectedCategory, user])
  );

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (selectedCategory) {
      query = query.eq('category', selectedCategory);
    }

    const { data, error } = await query;
    if (!error && data) {
      setProducts(data.filter(item => item.is_sold !== true));
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    if (user) await fetchFavorites();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'Neighbor';

  const renderHeader = () => (
    <View>
      {/* Header (Greeting & Location) */}
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <Text style={styles.greetingText}>Hi, {userName} 👋</Text>
          <TouchableOpacity style={styles.locationSelector} onPress={() => router.push('/location')}>
            <Ionicons name="location" size={14} color={colors.primary} />
            <Text style={styles.locationText} numberOfLines={1}>{locationName}</Text>
            <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
          {notifications.length > 0 && (
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>
                {notifications.length > 9 ? '9+' : notifications.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Promotional Banner */}
      <View style={styles.bannerContainer}>
        <Text style={styles.bannerSubtitle}>❤️  Spread Kindness</Text>
        <Text style={styles.bannerTitle}>Give Freely.{'\n'}Help Genuinely.</Text>
        <TouchableOpacity style={styles.bannerBtn} onPress={() => router.push('/(tabs)/post')}>
          <Text style={styles.bannerBtnText}>Give an Item</Text>
          <Ionicons name="arrow-forward-circle" size={18} color={colors.primary} />
        </TouchableOpacity>
        <Image 
          source={require('../../assets/images/banner-illustration.png')} 
          style={styles.bannerImage} 
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/search')}>
          <View style={styles.searchAiBadge}>
            <Text style={styles.searchAiText}>AI</Text>
          </View>
          <Ionicons name="search" size={20} color={colors.primary} />
          <Text style={styles.searchPlaceholder}>Search cars, phones, furniture...</Text>
          <Ionicons name="mic-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => router.push('/categories')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItem}
                onPress={() => setSelectedCategory(isSelected ? null : cat.name)}
              >
                <View style={[styles.categoryIcon, isSelected && styles.categoryIconActive]}>
                  <Ionicons
                    name={cat.icon as any}
                    size={28}
                    color={isSelected ? colors.surface : colors.primary}
                  />
                </View>
                <Text style={[styles.categoryName, isSelected && styles.categoryNameActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>



      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>
          {selectedCategory ? `Showing ${selectedCategory}` : 'Recommended for you'}
        </Text>
        <TouchableOpacity onPress={() => router.push('/search')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.promoContainer}>
      <Text style={styles.promoLabel}>Sponsored / Promotions</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.adsScroll}>
        
        {/* Column 1 */}
        <View style={styles.adColumn}>
          <View style={styles.adCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600&auto=format&fit=crop' }} 
              style={styles.adMedia} 
            />
            <View style={styles.adContent}>
              <Text style={styles.adTitle}>Summer Sale Extravaganza</Text>
              <Text style={styles.adDesc}>Get up to 70% off on your favorite brands.</Text>
              <TouchableOpacity style={styles.promoBtn}>
                <Text style={styles.promoBtnText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.adCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop' }} 
              style={styles.adMedia} 
            />
            <View style={styles.adContent}>
              <Text style={styles.adTitle}>Tech Gadgets</Text>
              <Text style={styles.adDesc}>Latest smart watches and accessories on discount.</Text>
              <TouchableOpacity style={styles.promoBtn}>
                <Text style={styles.promoBtnText}>Explore</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Column 2 */}
        <View style={styles.adColumn}>
          <View style={styles.adCard}>
            <Video
              source={{ uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
              style={styles.adMedia}
              useNativeControls={false}
              resizeMode={ResizeMode.COVER}
              isLooping
              shouldPlay
              isMuted
            />
            <View style={styles.adContent}>
              <Text style={styles.adTitle}>ThankU Premium</Text>
              <Text style={styles.adDesc}>Boost your posts and reach more neighbors instantly!</Text>
              <TouchableOpacity style={styles.promoBtn}>
                <Text style={styles.promoBtnText}>Upgrade</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.adCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop' }} 
              style={styles.adMedia} 
            />
            <View style={styles.adContent}>
              <Text style={styles.adTitle}>Sneaker Drops</Text>
              <Text style={styles.adDesc}>Exclusive early access to limited edition sneakers.</Text>
              <TouchableOpacity style={styles.promoBtn}>
                <Text style={styles.promoBtnText}>View Drops</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Feed */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          ListHeaderComponent={renderHeader}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              imageSource={require('../../assets/images/empty-state.png')}
              title="No items found"
              body="There are no items matching your search criteria."
              ctaTitle="Clear Filters"
              onCtaPress={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <DonationCard
                id={item.id}
                title={item.title}
                imageUrl={item.image_url}
                location={item.location}
                condition={item.condition}
                category={item.category}
                createdAt={item.created_at}
                isFavorite={favorites.has(item.id)}
                onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
                onFavoritePress={() => toggleFavorite(item.id)}
              />
            </View>
          )}
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

  // ─── Header ──────────────────────────────────────
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    paddingTop: spacing.large,
    paddingBottom: spacing.small,
  },
  headerLeft: {
    flex: 1,
  },
  greetingText: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  notifBtn: {
    position: 'relative',
    padding: 4,
    backgroundColor: colors.surface,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  notifBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  notifBadgeText: {
    color: colors.surface,
    fontSize: 9,
    fontWeight: 'bold',
  },

  // ─── Banner ──────────────────────────────────────
  bannerContainer: {
    marginHorizontal: spacing.medium,
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.medium,
    position: 'relative',
    overflow: 'hidden',
    height: 160,
    justifyContent: 'center',
    ...shadows.md,
  },
  bannerSubtitle: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '700',
    marginBottom: spacing.micro,
  },
  bannerTitle: {
    ...typography.h2,
    color: colors.surface,
    fontSize: 22,
    lineHeight: 28,
    marginBottom: spacing.medium,
    width: '60%',
  },
  bannerBtn: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.medium,
    paddingVertical: 10,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.tiny,
    ...shadows.sm,
  },
  bannerBtnText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  bannerImage: {
    position: 'absolute',
    right: -20,
    bottom: -10,
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },

  // ─── Top Bar ──────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  userName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.small,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.micro,
    borderRadius: radius.full,
    gap: 4,
    maxWidth: 140,
  },


  // ─── Search ──────────────────────────────────────
  searchContainer: {
    paddingHorizontal: spacing.medium,
    marginTop: spacing.medium,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: spacing.small,
    paddingVertical: 12,
    gap: spacing.tiny,
    ...shadows.sm,
  },
  searchAiBadge: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  searchAiText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  searchPlaceholder: {
    ...typography.bodySmall,
    color: colors.textDisabled,
    flex: 1,
  },



  // ─── Sections ────────────────────────────────────
  section: {
    paddingTop: spacing.large,
    paddingBottom: spacing.tiny,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    marginBottom: spacing.small,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  seeAllText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '700',
  },

  // ─── Categories ──────────────────────────────────
  categoryScroll: {
    paddingHorizontal: spacing.medium,
    gap: spacing.medium,
  },
  categoryItem: {
    alignItems: 'center',
    width: 72,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 20, // Soft rounded squares
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.tiny,
    ...shadows.sm,
  },
  categoryIconActive: {
    backgroundColor: colors.primary,
  },
  categoryName: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryNameActive: {
    color: colors.primary,
  },



  // ─── Results ─────────────────────────────────────
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    paddingTop: spacing.large,
    paddingBottom: spacing.small,
  },
  resultsTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  resultsCount: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },

  // ─── Feed ────────────────────────────────────────
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  row: {
    paddingHorizontal: spacing.small,
    gap: spacing.tiny,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: '50%',
    paddingHorizontal: spacing.micro,
  },

  // ─── Promo Footer ────────────────────────────────
  promoContainer: {
    paddingTop: spacing.large,
    paddingBottom: spacing.xxl,
  },
  promoLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.tiny,
    paddingHorizontal: spacing.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  adsScroll: {
    paddingHorizontal: spacing.medium,
    gap: spacing.medium,
  },
  adColumn: {
    gap: spacing.medium,
  },
  adCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    width: 280,
    overflow: 'hidden',
    ...shadows.sm,
  },
  adMedia: {
    width: '100%',
    height: 140,
    backgroundColor: colors.border,
  },
  adContent: {
    padding: spacing.medium,
  },
  adTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  adDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.small,
  },
  promoBtn: {
    backgroundColor: colors.highlight,
    paddingHorizontal: spacing.small,
    paddingVertical: 6,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  promoBtnText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
});

