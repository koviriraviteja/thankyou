import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/context/AuthContext';

const COLORS = {
  primary: '#002f34',
  secondary: '#00a49f',
  bg: '#f8f9fa',
  white: '#ffffff',
  textLight: '#406367',
  border: '#d8dfe0',
};

export default function MyAdsScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'ADS' | 'FAVORITES'>('ADS');
  const [myAds, setMyAds] = useState<any[]>([]);
  const [favoriteAds, setFavoriteAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        fetchMyAds();
      } else {
        setLoading(false);
      }
    }, [user])
  );

  const fetchMyAds = async () => {
    setLoading(true);
    
    // Fetch My Ads
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching my ads:', error);
    } else if (data) {
      setMyAds(data);
    }

    // Fetch My Favorites
    const { data: favData } = await supabase
      .from('favorites')
      .select('product:product_id(*)')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
      
    if (favData) {
      // filter out any null products if deleted
      setFavoriteAds(favData.map(f => f.product).filter(Boolean));
    }
    
    setLoading(false);
  };

  const markAsSold = async (productId: string) => {
    const { error } = await supabase.from('products').update({ is_sold: true }).eq('id', productId);
    if (!error) fetchMyAds();
  };

  const toggleFavorite = async (productId: string) => {
    await supabase.from('favorites').delete().match({ user_id: user?.id, product_id: productId });
    fetchMyAds();
  };

  const renderMyAds = () => {
    if (loading) return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />;
    
    return (
      <FlatList
        data={myAds}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>You haven't posted any ads yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.adCard}>
            <View style={styles.adRow}>
              <Image source={{ uri: item.image_url }} style={styles.adImage} />
              <View style={styles.adInfo}>
                <Text style={styles.adTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.adPrice}>{item.price}</Text>
                <View style={styles.adStats}>
                  <Ionicons name="eye-outline" size={14} color={COLORS.textLight} />
                  <Text style={styles.statText}>0 Views</Text>
                  <Ionicons name="heart-outline" size={14} color={COLORS.textLight} style={{ marginLeft: 12 }} />
                  <Text style={styles.statText}>0 Likes</Text>
                </View>
              </View>
            </View>
            <View style={styles.adFooter}>
              <Text style={[styles.statusText, item.is_sold && { color: 'red' }]}>{item.is_sold ? 'SOLD' : 'ACTIVE'}</Text>
              <View style={styles.actionButtons}>
                {!item.is_sold && (
                  <>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => router.push({ pathname: '/edit-ad', params: { id: item.id } })}>
                      <Text style={styles.actionBtnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.sellBtn]} onPress={() => markAsSold(item.id)}>
                      <Text style={[styles.actionBtnText, styles.sellBtnText]}>Mark as Sold</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        )}
      />
    );
  };

  const renderFavorites = () => (
    <FlatList
      data={favoriteAds}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={<Text style={styles.emptyText}>You haven't liked any ads yet.</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.adCard}
          onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
        >
          <View style={styles.adRow}>
            <Image source={{ uri: item.image_url }} style={styles.adImage} />
            <View style={styles.adInfo}>
              <Text style={styles.adTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.adPrice}>{item.price}</Text>
              <Text style={styles.adLocation}>{item.location}</Text>
            </View>
            <TouchableOpacity style={styles.favIcon} onPress={() => toggleFavorite(item.id)}>
              <Ionicons name="heart" size={24} color={'red'} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Ads</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'ADS' && styles.activeTab]}
          onPress={() => setActiveTab('ADS')}
        >
          <Text style={[styles.tabText, activeTab === 'ADS' && styles.activeTabText]}>ADS</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'FAVORITES' && styles.activeTab]}
          onPress={() => setActiveTab('FAVORITES')}
        >
          <Text style={[styles.tabText, activeTab === 'FAVORITES' && styles.activeTabText]}>FAVORITES</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'ADS' ? renderMyAds() : renderFavorites()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 16, backgroundColor: COLORS.white },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  tabContainer: { flexDirection: 'row', backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: 'bold', color: COLORS.textLight },
  activeTabText: { color: COLORS.primary },
  content: { flex: 1 },
  listContent: { padding: 16 },
  emptyText: { textAlign: 'center', color: COLORS.textLight, marginTop: 40, fontSize: 16 },
  adCard: { backgroundColor: COLORS.white, borderRadius: 8, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  adRow: { flexDirection: 'row' },
  adImage: { width: 80, height: 80, borderRadius: 4, backgroundColor: '#e0e0e0', marginRight: 12 },
  adInfo: { flex: 1, justifyContent: 'center' },
  adTitle: { fontSize: 14, color: COLORS.textLight, marginBottom: 4 },
  adPrice: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginBottom: 8 },
  adLocation: { fontSize: 12, color: COLORS.textLight },
  adStats: { flexDirection: 'row', alignItems: 'center' },
  statText: { fontSize: 12, color: COLORS.textLight, marginLeft: 4 },
  favIcon: { padding: 4 },
  adFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border },
  statusText: { fontSize: 12, fontWeight: 'bold', color: '#4caf50' },
  actionButtons: { flexDirection: 'row', gap: 8 },
  actionBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4, borderWidth: 1, borderColor: COLORS.primary },
  actionBtnText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },
  sellBtn: { backgroundColor: COLORS.primary },
  sellBtnText: { color: COLORS.white },
});
