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
  TouchableOpacity, Image, ImageBackground, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
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
  { id: '1', name: 'Furniture', image: require('../../assets/images/categories/furniture.png') },
  { id: '2', name: 'Electronics', image: require('../../assets/images/categories/electronics.png') },
  { id: '3', name: 'Books', image: require('../../assets/images/categories/books.png') },
  { id: '4', name: 'Clothing', image: require('../../assets/images/categories/dress.png') },
  { id: '5', name: 'Toys', image: require('../../assets/images/categories/teddy.png') },
  { id: '6', name: 'Kitchen', image: require('../../assets/images/categories/kitchen.png') },
  { id: '7', name: 'Sports', image: require('../../assets/images/categories/dumbbell.png') },
  { id: '8', name: 'Medical', image: require('../../assets/images/categories/medical.png') },
  { id: '9', name: 'Nature/Plants', image: require('../../assets/images/categories/plant.png') },
  { id: '10', name: 'Food', image: require('../../assets/images/categories/food.png') },
  { id: '11', name: 'Miscellaneous (Other)', image: require('../../assets/images/categories/globe.png') },
];

const DISTANCE_FILTERS = ['1 km', '5 km', '10 km', '20 km'];
const CONDITION_FILTERS = ['All', 'New', 'Like New', 'Good', 'Used'];

export default function HomeFeedScreen() {
  const { colors, isDark } = useTheme();
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
    <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>

      {/* Greeting */}
      <View style={{ marginBottom: spacing.medium }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.textPrimary }}>Hello, {userName}! 👋</Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>What are you looking for today?</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/search')}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <Text style={styles.searchPlaceholder} numberOfLines={1}>Search for items, people or categories...</Text>
        </TouchableOpacity>
      </View>

      {/* Promotional Banner */}
      <View style={{ ...shadows.sm, marginBottom: 12, borderRadius: 24 }}>
        <View style={[styles.bannerContainer, { backgroundColor: colors.highlight, padding: 24, borderRadius: 24, flexDirection: 'row', overflow: 'hidden' }]}>
          <View style={{ flex: 1, zIndex: 1, justifyContent: 'center' }}>
            <Text style={[styles.bannerTitle, { ...typography.h1, fontSize: 24, lineHeight: 30, color: colors.textPrimary, marginBottom: 16 }]}>
              Give what you{'\n'}don't need.{'\n'}Get what you{'\n'}truly need. <Text style={{ color: colors.secondary }}>💚</Text>
            </Text>
            <View style={{ alignSelf: 'flex-start', ...shadows.md, marginTop: 12, borderRadius: 999 }}>
              <TouchableOpacity 
                style={{ borderRadius: 999, overflow: 'hidden' }} 
                onPress={() => router.push('/categories')}
              >
                <LinearGradient
                  colors={['#00BFA5', '#00796B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 24, gap: 8 }}
                >
                  <Text style={[{ ...typography.label, color: '#FFFFFF', fontSize: 15, letterSpacing: 0.5 }]}>Explore Now</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
          <Image
            source={require('../../assets/images/hands_holding_gift.png')}
            style={{ width: 240, height: 250, position: 'absolute', right: 5, bottom: -55, transform: [{ scale: 1.2 }], resizeMode: 'contain' }}
          />
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <View style={styles.categoriesRow}>
          {CATEGORIES.slice(0, 7).map(cat => {
            const isSelected = selectedCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItemFlex}
                onPress={() => router.push({ pathname: '/search', params: { category: cat.name } })}
              >
                <View style={[styles.categoryIcon, isSelected && styles.categoryIconActive]}>
                  <Image source={cat.image} style={styles.categoryImage as any} />
                </View>
                <Text style={[styles.categoryName, isSelected && styles.categoryNameActive]} numberOfLines={2}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            style={styles.categoryItemFlex}
            onPress={() => router.push('/categories')}
          >
            <View style={styles.categoryIcon}>
              <Image source={require('../../assets/images/categories/four_dots.png')} style={styles.categoryImage as any} />
            </View>
            <Text style={styles.categoryName} numberOfLines={2}>
              More
            </Text>
          </TouchableOpacity>
        </View>
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
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Sponsored / Promotions</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.adsScroll}>

        {/* Column 1 */}
        <View style={styles.adColumn}>
          <View style={styles.adCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600&auto=format&fit=crop' }}
              style={styles.adMedia as any}
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
              style={styles.adMedia as any}
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
              style={styles.adMedia as any}
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

      {/* Sticky Top Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, backgroundColor: colors.background, zIndex: 10 }}>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, paddingRight: 16 }}
          onPress={() => router.push('/location')}
        >
          <Ionicons name="location" size={22} color={colors.primary} />
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary }} numberOfLines={1}>
            {locationName}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={() => router.push('/search')} style={styles.notifBtn}>
            <Ionicons name="search-outline" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
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
      </View>

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
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -150 },
      { translateY: -150 }
    ],
    width: 300,
    height: 300,
    resizeMode: 'contain',
    zIndex: -1,
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
    borderRadius: radius.xl,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 160,
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
    marginTop: spacing.small,
    marginBottom: spacing.small,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingLeft: spacing.medium,
    paddingRight: spacing.small,
    paddingVertical: 10,
    gap: spacing.tiny,
    ...shadows.sm,
  },
  filterIconContainer: {
    backgroundColor: '#0066FF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchAiBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  searchAiText: {
    color: '#FFFFFF',
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
    paddingTop: 0,
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
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: spacing.tiny,
  },
  categoryItemFlex: {
    alignItems: 'center',
    width: '25%',
    marginBottom: spacing.medium,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.tiny,
    overflow: 'hidden',
  },
  categoryIconActive: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  categoryImage: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
  categoryName: {
    ...typography.caption,
    fontSize: 10,
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
    paddingHorizontal: 12, // 12px + 4px from cardWrapper = 16px total margin
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
    height: 270, // Enforce fixed height so rows align perfectly
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
    flex: 1,
    justifyContent: 'space-between',
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

