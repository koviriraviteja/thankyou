import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, FlatList, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/context/AuthContext';

import { LinearGradient } from 'expo-linear-gradient';

type ActiveTab = 'ACTIVE' | 'SOLD' | 'EXPIRED';

export default function MyAdsScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('ACTIVE');
  const [activeAds, setActiveAds] = useState<any[]>([]);
  const [soldAds, setSoldAds] = useState<any[]>([]);
  const [expiredAds, setExpiredAds] = useState<any[]>([]);
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
      
    if (data) {
      setActiveAds(data.filter(item => !item.is_sold));
      setSoldAds(data.filter(item => item.is_sold));
      setExpiredAds([]); // Placeholder for expired
    }
    setLoading(false);
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardImageContainer}>
          <Image source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} style={styles.cardImage} />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            <TouchableOpacity style={styles.optionsBtn}>
              <Ionicons name="ellipsis-vertical" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          <Text style={styles.cardCondition}>{item.condition || 'Good Condition'}</Text>
          <Text style={styles.cardFreeText}>FREE</Text>
          
          <View style={styles.cardStats}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.cardStatsText}>Views{'\n'}<Text style={{fontWeight: 'bold', color: '#1C1C1E'}}>12</Text></Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
              <Text style={styles.cardStatsText}>Chats{'\n'}<Text style={{fontWeight: 'bold', color: '#1C1C1E'}}>0</Text></Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const currentData = activeTab === 'ACTIVE' ? activeAds : (activeTab === 'SOLD' ? soldAds : expiredAds);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={{ width: 40 }}>
          <Ionicons name="menu" size={28} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Listings</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="reorder-four" size={28} color="#1C1C1E" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ACTIVE' && styles.tabActive]}
          onPress={() => setActiveTab('ACTIVE')}
        >
          <Text style={[styles.tabText, activeTab === 'ACTIVE' && styles.tabTextActive]}>
            Active ({activeAds.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'SOLD' && styles.tabActive]}
          onPress={() => setActiveTab('SOLD')}
        >
          <Text style={[styles.tabText, activeTab === 'SOLD' && styles.tabTextActive]}>
            Sold ({soldAds.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'EXPIRED' && styles.tabActive]}
          onPress={() => setActiveTab('EXPIRED')}
        >
          <Text style={[styles.tabText, activeTab === 'EXPIRED' && styles.tabTextActive]}>
            Expired ({expiredAds.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={currentData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="albums-outline" size={64} color="#E5E5EA" />
              <Text style={styles.emptyText}>You don't have any {activeTab.toLowerCase()} listings yet.</Text>
            </View>
          ) : null
        }
      />
      
      {/* Bottom Button */}
      <View style={styles.bottomBtnContainer}>
        <TouchableOpacity style={styles.postBtn} onPress={() => router.push('/(tabs)/post')}>
          <LinearGradient
            colors={['#0066FF', '#34C759']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[StyleSheet.absoluteFill, { borderRadius: 28 }]}
          />
          <Ionicons name="add" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.postBtnText}>Post New Item</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  headerIconBtn: {
    marginLeft: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#0066FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  tabTextActive: {
    color: '#0066FF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  
  // ─── Item Card ───────────────────────────────────────
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  optionsBtn: {
    padding: 4,
    marginRight: -4,
    marginTop: -4,
  },
  cardCondition: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 6,
  },
  cardFreeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 12,
  },
  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  cardStatsText: {
    fontSize: 10,
    color: '#8E8E93',
  },

  // ─── Empty State ─────────────────────────────────────
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 16,
  },
  bottomBtnContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  postBtn: {
    flexDirection: 'row',
    height: 56,
    width: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  postBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
