import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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

export default function LocationScreen() {
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [placesSuggestions, setPlacesSuggestions] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleSelect = (city: string) => {
    router.navigate({ pathname: '/(tabs)/', params: { newLocation: city } });
  };

  const fetchCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Location Access Denied');
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
        handleSelect(`${preciseLocation}, ${country}`);
      }
    } catch (e) {
      alert('Location Error');
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!locationSearchQuery.trim()) {
        setPlacesSuggestions([]);
        return;
      }
      try {
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
          setPlacesSuggestions([]);
        }
      } catch (error) {
        console.error('Places API Catch Error:', error);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [locationSearchQuery]);

  const handleNativeGeocodeSearch = () => {
    if (!locationSearchQuery.trim()) return;
    handleSelect(locationSearchQuery.trim());
  };

  const activeStateData = selectedState ? STATES_DATA.find(s => s.state === selectedState) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          {selectedState ? (
            <TouchableOpacity onPress={() => setSelectedState(null)} style={{ padding: 4 }}>
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
              <Ionicons name="close" size={28} color={COLORS.primary} />
            </TouchableOpacity>
          )}
          <Text style={styles.title}>{selectedState ? selectedState : 'Location'}</Text>
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
                    autoFocus={true}
                  />
                  {locationSearchQuery.length > 0 && (
                    <TouchableOpacity onPress={handleNativeGeocodeSearch} style={styles.findBtn}>
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
                  <TouchableOpacity style={styles.currentLocationBtn} onPress={fetchCurrentLocation}>
                    <Ionicons name="locate" size={24} color={COLORS.secondary} />
                    <View style={{ marginLeft: 12 }}>
                      <Text style={{ fontSize: 16, color: COLORS.secondary, fontWeight: 'bold' }}>Use current location</Text>
                      <Text style={{ fontSize: 12, color: COLORS.textLight }}>Enable location services</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              {placesSuggestions.length > 0 ? (
                <ScrollView style={styles.suggestionsList} keyboardShouldPersistTaps="handled">
                  {placesSuggestions.map((suggestion) => {
                    const place = suggestion.placePrediction;
                    const placeId = place?.placeId;
                    const mainText = place?.structuredFormat?.mainText?.text || place?.text?.text?.split(',')[0];
                    const secondaryText = place?.structuredFormat?.secondaryText?.text || place?.text?.text;
                    
                    return (
                      <TouchableOpacity key={placeId} style={styles.rowItem} onPress={() => handleSelect(mainText)}>
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
                      <Text style={[styles.stateText, { color: COLORS.secondary, fontWeight: 'bold' }]}>Search map for "{locationSearchQuery}"</Text>
                    </TouchableOpacity>
                  ) : (
                    <>
                      <Text style={styles.sectionTitle}>Popular Cities</Text>
                      <View style={styles.gridContainer}>
                        {POPULAR_CITIES.map(city => (
                          <TouchableOpacity key={city.name} style={styles.gridItem} onPress={() => handleSelect(city.name)}>
                            <View style={styles.cityIconCircle}>
                              <Ionicons name={city.icon as any} size={24} color={COLORS.primary} />
                            </View>
                            <Text style={styles.gridText}>{city.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      <View style={styles.divider} />
                      <Text style={styles.sectionTitle}>Choose State</Text>
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
            <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
              <TouchableOpacity style={styles.stateRow} onPress={() => handleSelect(activeStateData?.state || '')}>
                <Text style={[styles.stateText, { fontWeight: 'bold' }]}>All in {activeStateData?.state}</Text>
              </TouchableOpacity>
              {activeStateData?.cities.map(city => (
                <TouchableOpacity key={city} style={styles.stateRow} onPress={() => handleSelect(city)}>
                  <Text style={styles.stateText}>{city}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.white },
  title: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 4, paddingHorizontal: 12, paddingVertical: 8 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: COLORS.primary },
  findBtn: { marginRight: 8, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: COLORS.secondary, borderRadius: 4 },
  currentLocationBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border, marginTop: 16 },
  suggestionsList: { flex: 1, backgroundColor: COLORS.white, elevation: 4 },
  rowItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginBottom: 16, marginTop: 8 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  gridItem: { width: '33%', alignItems: 'center', marginBottom: 20 },
  cityIconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.gray, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  gridText: { fontSize: 13, color: COLORS.primary, textAlign: 'center' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 16 },
  stateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  stateText: { fontSize: 16, color: COLORS.primary },
});
