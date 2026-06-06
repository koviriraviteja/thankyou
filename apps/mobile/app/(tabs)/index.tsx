import React from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const COLORS = {
  primary: '#002f34',
  secondary: '#00a49f',
  bg: '#f8f9fa',
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
];

const MOCK_ADS = [
  { id: '1', title: 'iPhone 13 Pro Max - Mint Condition', price: '₹45,000', location: 'Indiranagar, Bangalore', date: 'TODAY', image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=300&q=80' },
  { id: '2', title: 'Sony Alpha a7III Camera Body', price: '₹1,10,000', location: 'Andheri West, Mumbai', date: 'YESTERDAY', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80' },
  { id: '3', title: 'Honda City V MT 2018 Petrol', price: '₹7,50,000', location: 'Gachibowli, Hyderabad', date: '2 DAYS AGO', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=300&q=80' },
  { id: '4', title: 'Royal Enfield Classic 350', price: '₹1,20,000', location: 'Connaught Place, Delhi', date: 'TODAY', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=300&q=80' },
];

export default function HomeFeedScreen() {
  const renderHeader = () => (
    <View>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={24} color={COLORS.primary} />
          <Text style={styles.locationText} numberOfLines={1}>India</Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => router.push('/search')}
        >
          <Ionicons name="search" size={20} color={COLORS.textLight} />
          <Text style={{ marginLeft: 8, fontSize: 16, color: COLORS.textLight, flex: 1 }}>
            Find Cars, Mobile Phones and more...
          </Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse categories</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesList}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id} style={styles.categoryItem}>
              <View style={styles.categoryIconCircle}>
                <Ionicons name={cat.icon as any} size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={[styles.sectionTitle, { paddingHorizontal: 16, marginTop: 16, marginBottom: 8 }]}>
        Fresh recommendations
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={MOCK_ADS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => {
              router.push({
                pathname: '/product/[id]',
                params: { 
                  id: item.id, 
                  title: item.title, 
                  price: item.price, 
                  location: item.location, 
                  date: item.date, 
                  image: item.image 
                }
              });
            }}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardFav}>
              <Ionicons name="heart-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.price}>{item.price}</Text>
              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.location} numberOfLines={1}>{item.location}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  topBar: { flexDirection: 'row', padding: 16, backgroundColor: COLORS.white, alignItems: 'center' },
  locationContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  locationText: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginHorizontal: 8, flex: 1 },
  searchContainer: { backgroundColor: COLORS.white, paddingHorizontal: 16, paddingBottom: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 4, paddingHorizontal: 12, paddingVertical: 8 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: COLORS.primary },
  categoriesSection: { backgroundColor: COLORS.white, paddingVertical: 16, marginTop: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  seeAll: { fontSize: 14, fontWeight: 'bold', color: COLORS.textLight, textDecorationLine: 'underline' },
  categoriesList: { paddingHorizontal: 12 },
  categoryItem: { alignItems: 'center', marginHorizontal: 8, width: 70 },
  categoryIconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  categoryName: { fontSize: 12, color: COLORS.primary, textAlign: 'center' },
  listContent: { paddingBottom: 24 },
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
