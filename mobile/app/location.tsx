/**
 * ThankU — Location Picker Screen
 *
 * Premium location picker with ThankU branding.
 * Features: Google Places autocomplete, popular cities grid, state/city drill-down.
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { useTheme } from '../src/context/ThemeContext';
import { typography } from '../src/theme/typography';
import { spacing } from '../src/theme/spacing';
import { radius } from '../src/theme/radius';
import { shadows } from '../src/theme/shadows';

const POPULAR_CITIES = [
  { name: 'Mumbai', image: require('../assets/logo.png') },
  { name: 'Delhi', image: require('../assets/logo.png') },
  { name: 'Bangalore', image: require('../assets/logo.png') },
  { name: 'Hyderabad', image: require('../assets/logo.png') },
  { name: 'Ahmedabad', image: require('../assets/logo.png') },
  { name: 'Chennai', image: require('../assets/logo.png') },
];

const STATES_DATA = [
  { state: 'Andaman and Nicobar', cities: ['Port Blair'] },
  { state: 'Andhra Pradesh', cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati'] },
  { state: 'Arunachal Pradesh', cities: ['Itanagar', 'Tawang', 'Naharlagun', 'Pasighat'] },
  { state: 'Assam', cities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon'] },
  { state: 'Bihar', cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia'] },
  { state: 'Chandigarh', cities: ['Chandigarh'] },
  { state: 'Chhattisgarh', cities: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg'] },
  { state: 'Delhi', cities: ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'] },
  { state: 'Goa', cities: ['Panaji', 'Vasco da Gama', 'Margao', 'Mapusa', 'Ponda'] },
  { state: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'] },
  { state: 'Haryana', cities: ['Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Rohtak', 'Hisar'] },
  { state: 'Himachal Pradesh', cities: ['Shimla', 'Manali', 'Dharamshala', 'Mandi', 'Solan'] },
  { state: 'Jammu and Kashmir', cities: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla'] },
  { state: 'Jharkhand', cities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar'] },
  { state: 'Karnataka', cities: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'] },
  { state: 'Kerala', cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Malappuram'] },
  { state: 'Madhya Pradesh', cities: ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain'] },
  { state: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad'] },
  { state: 'Odisha', cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur'] },
  { state: 'Punjab', cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'] },
  { state: 'Rajasthan', cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'] },
  { state: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'] },
  { state: 'Telangana', cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'] },
  { state: 'Uttar Pradesh', cities: ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Noida'] },
  { state: 'Uttarakhand', cities: ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rishikesh'] },
  { state: 'West Bengal', cities: ['Kolkata', 'Howrah', 'Darjeeling', 'Siliguri', 'Asansol'] },
];

export default function LocationScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [placesSuggestions, setPlacesSuggestions] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleSelect = (city: string) => {
    router.navigate({ pathname: '/(tabs)/', params: { newLocation: city } });
  };

  const fetchCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') { alert('Location Access Denied'); return; }
    try {
      let location = await Location.getCurrentPositionAsync({});
      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      if (geocode.length > 0) {
        const { district, city, region, country, name } = geocode[0];
        const preciseLocation = district || city || region || name;
        handleSelect(`${preciseLocation}, ${country}`);
      }
    } catch { alert('Location Error'); }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!locationSearchQuery.trim()) { setPlacesSuggestions([]); return; }
      try {
        const url = `https://places.googleapis.com/v1/places:autocomplete`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': 'AIzaSyAfubfGmnjaqdF28HCTtx_VuMcBG-3_fZI',
          },
          body: JSON.stringify({ input: locationSearchQuery, includedRegionCodes: ['in'] }),
        });
        const data = await res.json();
        setPlacesSuggestions(data.suggestions || []);
      } catch (error) {
        console.error('Places API error:', error);
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
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          {selectedState ? (
            <TouchableOpacity onPress={() => setSelectedState(null)}>
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>{selectedState || 'Location'}</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={{ flex: 1 }}>
          {!selectedState ? (
            <>
              {/* Search */}
              <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                  <Ionicons name="search" size={18} color={colors.textSecondary} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search city, area, or neighbourhood"
                    placeholderTextColor={colors.textDisabled}
                    value={locationSearchQuery}
                    onChangeText={setLocationSearchQuery}
                    onSubmitEditing={handleNativeGeocodeSearch}
                    autoFocus
                  />
                  {locationSearchQuery.length > 0 && (
                    <TouchableOpacity onPress={handleNativeGeocodeSearch} style={styles.findBtn}>
                      <Text style={styles.findBtnText}>Find</Text>
                    </TouchableOpacity>
                  )}
                  {locationSearchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setLocationSearchQuery('')}>
                      <Ionicons name="close-circle" size={18} color={colors.textDisabled} />
                    </TouchableOpacity>
                  )}
                </View>

                {!locationSearchQuery && (
                  <TouchableOpacity style={styles.currentLocationBtn} onPress={fetchCurrentLocation}>
                    <Ionicons name="locate" size={22} color={colors.primary} />
                    <View style={{ marginLeft: spacing.small }}>
                      <Text style={styles.currentLocationTitle}>Use current location</Text>
                      <Text style={styles.currentLocationSub}>Enable location services</Text>
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
                      <TouchableOpacity key={placeId} style={styles.suggestionRow} onPress={() => handleSelect(mainText)}>
                        <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
                        <View style={{ marginLeft: spacing.small, flex: 1 }}>
                          <Text style={styles.suggestionMain}>{mainText}</Text>
                          <Text style={styles.suggestionSecondary} numberOfLines={1}>{secondaryText}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              ) : (
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.medium }} keyboardShouldPersistTaps="handled">
                  {locationSearchQuery.length > 0 ? (
                    <TouchableOpacity style={styles.stateRow} onPress={handleNativeGeocodeSearch}>
                      <Ionicons name="map-outline" size={20} color={colors.primary} />
                      <Text style={styles.searchMapText}>Search map for "{locationSearchQuery}"</Text>
                    </TouchableOpacity>
                  ) : (
                    <>
                      <Text style={styles.sectionTitle}>Popular Cities</Text>
                      <View style={styles.gridContainer}>
                        {POPULAR_CITIES.map(city => (
                          <TouchableOpacity key={city.name} style={styles.gridItem} onPress={() => handleSelect(city.name)}>
                            <View style={[styles.cityIconCircle, { padding: 0, overflow: 'hidden' }]}>
                              <Image source={city.image} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
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
                          <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
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
                <Text style={[styles.stateText, { fontWeight: '700', color: colors.primary }]}>
                  All in {activeStateData?.state}
                </Text>
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

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.medium, paddingVertical: spacing.small,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: { ...typography.h3, color: colors.textPrimary, flex: 1, textAlign: 'center' },

  // ─── Search ──────────────────────────────────────
  searchSection: { paddingHorizontal: spacing.medium, paddingTop: spacing.medium, backgroundColor: colors.surface },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background,
    borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.md,
    paddingHorizontal: spacing.small, paddingVertical: spacing.tiny, gap: spacing.tiny,
  },
  searchInput: { flex: 1, ...typography.body, color: colors.textPrimary, paddingVertical: spacing.tiny },
  findBtn: {
    backgroundColor: colors.primary, paddingHorizontal: spacing.small, paddingVertical: spacing.micro,
    borderRadius: radius.sm, marginRight: spacing.tiny,
  },
  findBtnText: { ...typography.caption, color: colors.textOnPrimary, fontWeight: '700' },
  currentLocationBtn: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.medium,
    borderBottomWidth: 1, borderBottomColor: colors.border, marginTop: spacing.small,
  },
  currentLocationTitle: { ...typography.body, color: colors.primary, fontWeight: '700' },
  currentLocationSub: { ...typography.caption, color: colors.textSecondary },

  // ─── Suggestions ─────────────────────────────────
  suggestionsList: { flex: 1, backgroundColor: colors.surface },
  suggestionRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.medium,
    paddingHorizontal: spacing.medium, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  suggestionMain: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  suggestionSecondary: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },

  // ─── Grid ────────────────────────────────────────
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.medium, marginTop: spacing.tiny },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { width: '33%', alignItems: 'center', marginBottom: spacing.large },
  cityIconCircle: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: colors.highlight,
    justifyContent: 'center', alignItems: 'center', marginBottom: spacing.tiny,
  },
  gridText: { ...typography.caption, color: colors.textPrimary, fontWeight: '600', textAlign: 'center' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.medium },

  // ─── States ──────────────────────────────────────
  stateRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: spacing.medium, paddingHorizontal: spacing.medium,
    borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  stateText: { ...typography.body, color: colors.textPrimary },
  searchMapText: { ...typography.body, color: colors.primary, fontWeight: '600', marginLeft: spacing.small },
});
