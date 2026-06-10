import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import * as Location from 'expo-location';
import { useAuth } from '../../src/context/AuthContext';
import { useNotification } from '../../src/context/NotificationContext';

const COLORS = {
  primary: '#059669', // Emerald Green
  secondary: '#10B981', // Emerald Light
  bg: '#ffffff',
  gray: '#f0f0f0',
  white: '#ffffff',
  textLight: '#4B5563', // Gray 600
  border: '#E5E7EB',
};

const CATEGORIES = [
  { id: '1', name: 'Clothes', icon: 'shirt-outline' },
  { id: '2', name: 'Books', icon: 'book-outline' },
  { id: '3', name: 'Toys', icon: 'happy-outline' },
  { id: '4', name: 'Food', icon: 'restaurant-outline' },
  { id: '5', name: 'Electronics', icon: 'tv-outline' },
  { id: '6', name: 'Furniture', icon: 'bed-outline' },
  { id: '7', name: 'Medical', icon: 'medkit-outline' },
  { id: '8', name: 'Others', icon: 'apps-outline' },
];

const POPULAR_CITIES = [
  { name: 'Mumbai', icon: 'business-outline' },
  { name: 'Delhi', icon: 'trail-sign-outline' },
  { name: 'Bangalore', icon: 'laptop-outline' },
  { name: 'Hyderabad', icon: 'restaurant-outline' },
  { name: 'Ahmedabad', icon: 'analytics-outline' },
  { name: 'Chennai', icon: 'sunny-outline' }
];

const STATES_DATA = [
  { state: 'Andaman and Nicobar', cities: ['Port Blair'] },
  { state: 'Andhra Pradesh', cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati'] },
  { state: 'Arunachal Pradesh', cities: ['Itanagar', 'Tawang', 'Naharlagun', 'Pasighat'] },
  { state: 'Assam', cities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon'] },
  { state: 'Bihar', cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia'] },
  { state: 'Chandigarh', cities: ['Chandigarh'] },
  { state: 'Chhattisgarh', cities: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg'] },
  { state: 'Dadra and Nagar Haveli', cities: ['Silvassa', 'Daman', 'Diu'] },
  { state: 'Delhi', cities: ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'] },
  { state: 'Goa', cities: ['Panaji', 'Vasco da Gama', 'Margao', 'Mapusa', 'Ponda'] },
  { state: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'] },
  { state: 'Haryana', cities: ['Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Rohtak', 'Hisar'] },
  { state: 'Himachal Pradesh', cities: ['Shimla', 'Manali', 'Dharamshala', 'Mandi', 'Solan'] },
  { state: 'Jammu and Kashmir', cities: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla'] },
  { state: 'Jharkhand', cities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar'] },
  { state: 'Karnataka', cities: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'] },
  { state: 'Kerala', cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Malappuram'] },
  { state: 'Ladakh', cities: ['Leh', 'Kargil'] },
  { state: 'Lakshadweep', cities: ['Kavaratti'] },
  { state: 'Madhya Pradesh', cities: ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain'] },
  { state: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad'] },
  { state: 'Manipur', cities: ['Imphal', 'Thoubal', 'Bishnupur'] },
  { state: 'Meghalaya', cities: ['Shillong', 'Tura', 'Jowai'] },
  { state: 'Mizoram', cities: ['Aizawl', 'Lunglei', 'Champhai'] },
  { state: 'Nagaland', cities: ['Kohima', 'Dimapur', 'Mokokchung'] },
  { state: 'Odisha', cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur'] },
  { state: 'Puducherry', cities: ['Puducherry', 'Oulgaret', 'Karaikal'] },
  { state: 'Punjab', cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'] },
  { state: 'Rajasthan', cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'] },
  { state: 'Sikkim', cities: ['Gangtok', 'Namchi', 'Geyzing'] },
  { state: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'] },
  { state: 'Telangana', cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'] },
  { state: 'Tripura', cities: ['Agartala', 'Dharmanagar', 'Udaipur'] },
  { state: 'Uttar Pradesh', cities: ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Noida'] },
  { state: 'Uttarakhand', cities: ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rishikesh'] },
  { state: 'West Bengal', cities: ['Kolkata', 'Howrah', 'Darjeeling', 'Siliguri', 'Asansol'] }
];

export default function HomeFeedScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [locationName, setLocationName] = useState('Fetching location...');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [sortOption, setSortOption] = useState<'NEWEST' | 'OLDEST'>('NEWEST');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  
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
      setSelectedLocationFilter(params.newLocation as string);
      router.setParams({ newLocation: '' });
    }
  }, [params.newLocation]);

  const fetchFavorites = async () => {
    const { data } = await supabase.from('favorites').select('product_id').eq('user_id', user?.id);
    if (data) {
      setFavorites(new Set(data.map(f => f.product_id)));
    }
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

  const fetchCurrentLocation = async () => {
    setLocationName('Fetching location...');
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocationName('Location Access Denied');
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      
      if (geocode.length > 0) {
        const { district, city, region, country, name } = geocode[0];
        const preciseLocation = district || city || region || name;
        setLocationName(`${preciseLocation}, ${country}`);
        setSelectedLocationFilter(null);
      } else {
        setLocationName('Unknown Location');
      }
    } catch (e) {
      setLocationName('Location Error');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProducts();
      if (user) {
        fetchFavorites();
      }
    }, [selectedCategory, selectedLocationFilter, user])
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

    if (selectedLocationFilter) {
      query = query.ilike('location', `%${selectedLocationFilter}%`);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
    } else if (data) {
      // Don't show sold products on the home feed (if the column exists and is true)
      const availableData = data.filter(item => item.is_sold !== true);
      applySort(availableData, sortOption);
    }
    setLoading(false);
  };

  const applySort = (dataList: any[], option: string) => {
    let sorted = [...dataList];
    if (option === 'OLDEST') {
      sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else {
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    setProducts(sorted);
  };

  useEffect(() => {
    if (products.length > 0) {
      applySort(products, sortOption);
    }
  }, [sortOption]);

  const renderHeader = () => (
    <View>
      <View style={styles.categoriesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse categories</Text>
          {selectedCategory && (
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text style={styles.seeAll}>Clear filter</Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesList}>
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.name;
            return (
              <TouchableOpacity 
                key={cat.id} 
                style={styles.categoryItem}
                onPress={() => setSelectedCategory(isSelected ? null : cat.name)}
              >
                <View style={[styles.categoryIconCircle, isSelected && styles.categoryIconCircleActive]}>
                  <Ionicons name={cat.icon as any} size={28} color={isSelected ? COLORS.white : COLORS.primary} />
                </View>
                <Text style={[styles.categoryName, isSelected && styles.categoryNameActive]}>{cat.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 16, marginBottom: 8 }}>
        <Text style={styles.sectionTitle}>
          {selectedCategory ? `Showing ${selectedCategory}` : 'Recent Donations'}
        </Text>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setSortModalVisible(true)}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.secondary, marginRight: 4 }}>
            {sortOption === 'NEWEST' ? 'Newest' : 'Oldest'}
          </Text>
          <Ionicons name="filter" size={16} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.locationContainer} onPress={() => router.push('/location')}>
          <Ionicons name="location-outline" size={24} color={COLORS.primary} />
          <Text style={styles.locationText} numberOfLines={1}>{locationName}</Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
        </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={{ position: 'relative' }}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
            {notifications.length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {notifications.length > 9 ? '9+' : notifications.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textLight} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Find Clothes, Books, Food and more..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            numColumns={2}
            ListHeaderComponent={renderHeader}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: 40, color: COLORS.textLight }}>
                No donations found in this area/category.
              </Text>
            }
            renderItem={({ item }) => {
              const timeStr = new Date(item.created_at).toLocaleDateString();
              return (
                <TouchableOpacity 
                  style={styles.card}
                  onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
                >
                  <Image source={{ uri: item.image_url }} style={styles.cardImage} />
                  <TouchableOpacity style={styles.cardFav} onPress={() => toggleFavorite(item.id)}>
                    <Ionicons 
                      name={favorites.has(item.id) ? "heart" : "heart-outline"} 
                      size={20} 
                      color={favorites.has(item.id) ? "red" : COLORS.primary} 
                    />
                  </TouchableOpacity>
                  <View style={styles.cardContent}>
                    <Text style={styles.price}>FREE</Text>
                    <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.location} numberOfLines={1}>{item.location.split(',')[0]}</Text>
                      <Text style={styles.date}>{timeStr}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>

      <Modal visible={sortModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.sortModalContainer}>
            <Text style={styles.modalTitle}>Sort By</Text>
            
            <TouchableOpacity 
              style={styles.sortOptionRow} 
              onPress={() => { setSortOption('NEWEST'); setSortModalVisible(false); }}
            >
              <Text style={[styles.sortOptionText, sortOption === 'NEWEST' && { color: COLORS.secondary, fontWeight: 'bold' }]}>Date Published (Newest)</Text>
              {sortOption === 'NEWEST' && <Ionicons name="checkmark" size={24} color={COLORS.secondary} />}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.sortOptionRow} 
              onPress={() => { setSortOption('OLDEST'); setSortModalVisible(false); }}
            >
              <Text style={[styles.sortOptionText, sortOption === 'OLDEST' && { color: COLORS.secondary, fontWeight: 'bold' }]}>Date Published (Oldest)</Text>
              {sortOption === 'OLDEST' && <Ionicons name="checkmark" size={24} color={COLORS.secondary} />}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.closeSortBtn} onPress={() => setSortModalVisible(false)}>
              <Text style={styles.closeSortText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: COLORS.white },
  locationContainer: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 16 },
  locationText: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginLeft: 8, marginRight: 4, flexShrink: 1 },
  searchContainer: { backgroundColor: COLORS.white, paddingHorizontal: 16, paddingBottom: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 4, paddingHorizontal: 12, paddingVertical: 8 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: COLORS.primary },
  
  gridText: { fontSize: 13, color: COLORS.primary, textAlign: 'center' },

  categoriesSection: { backgroundColor: COLORS.white, paddingVertical: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  seeAll: { fontSize: 14, fontWeight: 'bold', color: COLORS.secondary },
  categoriesList: { paddingHorizontal: 12 },
  categoryItem: { alignItems: 'center', marginHorizontal: 8, width: 70 },
  categoryIconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.gray, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  categoryIconCircleActive: { backgroundColor: COLORS.secondary },
  categoryName: { fontSize: 12, color: COLORS.primary, textAlign: 'center' },
  categoryNameActive: { fontWeight: 'bold', color: COLORS.secondary },

  content: { flex: 1 },
  listContent: { paddingBottom: 24, paddingTop: 8 },
  row: { paddingHorizontal: 12, justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: COLORS.white, borderRadius: 4, marginBottom: 12, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  cardImage: { width: '100%', height: 140, backgroundColor: '#e0e0e0' },
  cardFav: { position: 'absolute', top: 8, right: 8, backgroundColor: COLORS.white, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41 },
  cardContent: { padding: 12 },
  price: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginBottom: 4 },
  title: { fontSize: 14, color: COLORS.textLight, height: 40 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, alignItems: 'center' },
  location: { fontSize: 10, color: COLORS.textLight, flex: 1, marginRight: 8 },
  date: { fontSize: 10, color: COLORS.textLight, fontWeight: '500' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sortModalContainer: { backgroundColor: COLORS.white, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20 },
  sortOptionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  sortOptionText: { fontSize: 16, color: COLORS.primary },
  closeSortBtn: { marginTop: 16, alignItems: 'center', paddingVertical: 12, backgroundColor: COLORS.gray, borderRadius: 8 },
  closeSortText: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.bg,
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  }
});
