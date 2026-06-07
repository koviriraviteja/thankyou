import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import * as Location from 'expo-location';

const COLORS = {
  primary: '#002f34',
  secondary: '#00a49f',
  bg: '#ffffff',
  gray: '#f0f0f0',
  white: '#ffffff',
  textLight: '#406367',
  border: '#d8dfe0',
};

const CATEGORIES = [
  { id: '1', name: 'Cars', icon: 'car-sport-outline' },
  { id: '2', name: 'Properties', icon: 'business-outline' },
  { id: '3', name: 'Mobiles', icon: 'phone-portrait-outline' },
  { id: '4', name: 'Jobs', icon: 'briefcase-outline' },
  { id: '5', name: 'Bikes', icon: 'bicycle-outline' },
  { id: '6', name: 'Electronics', icon: 'tv-outline' },
  { id: '7', name: 'Furniture', icon: 'bed-outline' },
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
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [placesSuggestions, setPlacesSuggestions] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

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
        const { city, region, country } = geocode[0];
        setLocationName(`${city || region}, ${country}`);
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
    }, [selectedCategory, selectedLocationFilter])
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
      setProducts(data);
    }
    setLoading(false);
  };

  const handleManualLocation = (city: string) => {
    setLocationName(city);
    setSelectedLocationFilter(city);
    setLocationModalVisible(false);
    setLocationSearchQuery('');
    setPlacesSuggestions([]);
    setSelectedState(null);
  };

  // Google Places Autocomplete Integration (New Places API)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!locationSearchQuery.trim()) {
        setPlacesSuggestions([]);
        return;
      }
      
      try {
        console.log("Fetching New Google Places API for:", locationSearchQuery);
        const url = `https://places.googleapis.com/v1/places:autocomplete`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': 'AIzaSyAfubfGmnjaqdF28HCTtx_VuMcBG-3_fZI'
          },
          body: JSON.stringify({
            input: locationSearchQuery,
            includedRegionCodes: ['in']
          })
        });
        const data = await res.json();
        
        if (data.suggestions) {
          setPlacesSuggestions(data.suggestions);
        } else {
          console.log("Google API Error:", data.error?.message || "Unknown error");
          setPlacesSuggestions([]);
        }
      } catch (error) {
        console.error('Places API Catch Error:', error);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [locationSearchQuery]);

  const handleNativeGeocodeSearch = async () => {
    if (!locationSearchQuery.trim()) return;
    try {
      const geocodeResult = await Location.geocodeAsync(locationSearchQuery);
      if (geocodeResult.length > 0) {
        const reverseResult = await Location.reverseGeocodeAsync({
          latitude: geocodeResult[0].latitude,
          longitude: geocodeResult[0].longitude
        });
        
        if (reverseResult.length > 0) {
          const { city, region, country } = reverseResult[0];
          const finalName = city || region || locationSearchQuery;
          handleManualLocation(finalName);
        } else {
          handleManualLocation(locationSearchQuery);
        }
      } else {
        handleManualLocation(locationSearchQuery);
      }
    } catch (e) {
      console.error(e);
      handleManualLocation(locationSearchQuery);
    }
  };

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

      <Text style={[styles.sectionTitle, { paddingHorizontal: 16, marginTop: 16, marginBottom: 8 }]}>
        {selectedCategory ? `Showing ${selectedCategory}` : 'Fresh recommendations'}
      </Text>
    </View>
  );

  const activeStateData = selectedState ? STATES_DATA.find(s => s.state === selectedState) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.locationContainer} onPress={() => setLocationModalVisible(true)}>
          <Ionicons name="location-outline" size={24} color={COLORS.primary} />
          <Text style={styles.locationText} numberOfLines={1}>{locationName}</Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textLight} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Find Cars, Mobile Phones and more..."
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
                No products found in this area/category.
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
                  <View style={styles.cardFav}>
                    <Ionicons name="heart-outline" size={20} color={COLORS.primary} />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.price}>{item.price}</Text>
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

      <Modal visible={locationModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
          {/* Dynamic Header based on Drill-down state */}
          <View style={styles.modalHeader}>
            {selectedState ? (
              <TouchableOpacity onPress={() => setSelectedState(null)} style={{ padding: 4 }}>
                <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setLocationModalVisible(false)} style={{ padding: 4 }}>
                <Ionicons name="close" size={28} color={COLORS.primary} />
              </TouchableOpacity>
            )}
            <Text style={styles.modalTitle}>{selectedState ? selectedState : 'Location'}</Text>
            <View style={{ width: 28 }} />
          </View>
          
          <View style={{ flex: 1 }}>
            {!selectedState ? (
              <>
                <View style={{ padding: 16, paddingBottom: 0 }}>
                  <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={COLORS.textLight} />
                    <TextInput 
                      style={styles.searchInput}
                      placeholder="Search city, area or neighbourhood"
                      placeholderTextColor={COLORS.textLight}
                      value={locationSearchQuery}
                      onChangeText={setLocationSearchQuery}
                      onSubmitEditing={handleNativeGeocodeSearch}
                      autoFocus={false}
                    />
                    {locationSearchQuery.length > 0 && (
                      <TouchableOpacity onPress={handleNativeGeocodeSearch} style={{ marginRight: 8, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: COLORS.secondary, borderRadius: 4 }}>
                        <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>Find</Text>
                      </TouchableOpacity>
                    )}
                    {locationSearchQuery.length > 0 && (
                      <TouchableOpacity onPress={() => setLocationSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
                      </TouchableOpacity>
                    )}
                  </View>

                  {!locationSearchQuery && (
                    <TouchableOpacity 
                      style={styles.currentLocationBtn}
                      onPress={() => {
                        setLocationModalVisible(false);
                        fetchCurrentLocation();
                      }}
                    >
                      <Ionicons name="locate" size={24} color={COLORS.secondary} />
                      <View style={{ marginLeft: 12 }}>
                        <Text style={{ fontSize: 16, color: COLORS.secondary, fontWeight: 'bold' }}>Use current location</Text>
                        <Text style={{ fontSize: 12, color: COLORS.textLight }}>Enable location services</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>

                {placesSuggestions.length > 0 ? (
                  <ScrollView style={{ flex: 1, backgroundColor: COLORS.white, elevation: 4 }} keyboardShouldPersistTaps="handled">
                    {placesSuggestions.map((suggestion) => {
                      const place = suggestion.placePrediction;
                      const placeId = place?.placeId;
                      const mainText = place?.structuredFormat?.mainText?.text || place?.text?.text?.split(',')[0];
                      const secondaryText = place?.structuredFormat?.secondaryText?.text || place?.text?.text;
                      
                      return (
                        <TouchableOpacity 
                          key={placeId} 
                          style={styles.suggestionRow} 
                          onPress={() => {
                            handleManualLocation(mainText);
                          }}
                        >
                          <Ionicons name="location-outline" size={20} color={COLORS.textLight} />
                          <View style={{ marginLeft: 12, flex: 1 }}>
                            <Text style={{ fontSize: 16, color: COLORS.primary }}>{mainText}</Text>
                            <Text style={{ fontSize: 12, color: COLORS.textLight }} numberOfLines={1}>{secondaryText}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                ) : (
                  <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
                    {locationSearchQuery.length > 0 ? (
                      <TouchableOpacity style={styles.stateRow} onPress={handleNativeGeocodeSearch}>
                        <Ionicons name="map-outline" size={24} color={COLORS.secondary} />
                        <Text style={[styles.stateText, { color: COLORS.secondary, fontWeight: 'bold' }]}>Search global map for "{locationSearchQuery}"</Text>
                      </TouchableOpacity>
                    ) : (
                      <>
                        <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Popular Cities</Text>
                        {/* 3-Column Grid for Popular Cities */}
                        <View style={styles.gridContainer}>
                          {POPULAR_CITIES.map(city => (
                            <TouchableOpacity key={city.name} style={styles.gridItem} onPress={() => handleManualLocation(city.name)}>
                              <View style={styles.cityIconCircle}>
                                <Ionicons name={city.icon as any} size={24} color={COLORS.primary} />
                              </View>
                              <Text style={styles.gridText}>{city.name}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>

                        <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 16 }} />

                        <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>Choose State</Text>
                        {STATES_DATA.map(st => (
                          <TouchableOpacity key={st.state} style={styles.stateRow} onPress={() => setSelectedState(st.state)}>
                            <Text style={styles.stateText}>{st.state}</Text>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
                          </TouchableOpacity>
                        ))}
                      </>
                    )}
                  </ScrollView>
                )}
              </>
            ) : (
              // Drill-down View: Cities in selected State
              <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
                <TouchableOpacity style={styles.stateRow} onPress={() => handleManualLocation(activeStateData?.state || '')}>
                  <Text style={[styles.stateText, { fontWeight: 'bold' }]}>All in {activeStateData?.state}</Text>
                </TouchableOpacity>
                {activeStateData?.cities.map(city => (
                  <TouchableOpacity key={city} style={styles.stateRow} onPress={() => handleManualLocation(city)}>
                    <Text style={styles.stateText}>{city}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </SafeAreaView>
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
  
  modalHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  currentLocationBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border, marginTop: 16 },
  suggestionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  gridItem: { width: '33%', alignItems: 'center', marginBottom: 20 },
  cityIconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.gray, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  gridText: { fontSize: 13, color: COLORS.primary, textAlign: 'center' },

  stateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  stateText: { fontSize: 16, color: COLORS.primary },

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
});
