import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'Electronics', image: require('../../assets/images/categories/electronics.png') },
  { id: '2', name: 'Home & Kitchen', image: require('../../assets/images/categories/kitchen.png') },
  { id: '3', name: 'Books & Stationery', image: require('../../assets/images/categories/books.png') },
  { id: '4', name: 'Furniture', image: require('../../assets/images/categories/furniture.png') },
  { id: '5', name: 'Fashion & Accessories', image: require('../../assets/images/categories/clothing.png') },
  { id: '6', name: 'Sports & Fitness', image: require('../../assets/images/categories/sports.png') },
  { id: '7', name: 'Kids & Toys', image: require('../../assets/images/categories/toys.png') },
  { id: '8', name: 'Vehicles', image: require('../../assets/images/categories/medical.png') }, 
  { id: '9', name: 'Others', image: require('../../assets/images/categories/misc.png') },
];

export default function CategoriesScreen() {

  const handleCategoryPress = (categoryName: string) => {
    router.navigate({
      pathname: '/(tabs)/',
      params: { category: categoryName }
    });
  };

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      {/* Join Community Banner */}
      <View style={styles.promoBanner}>
        <View style={styles.promoTextContainer}>
          <Text style={styles.promoTitle}>
            <Text style={{color: '#1C1C1E'}}>Join the </Text>
            <Text style={{color: '#34C759'}}>THANKQ</Text>
            <Text style={{color: '#1C1C1E'}}> Community{'\n'}and make a difference.</Text>
          </Text>
          <TouchableOpacity style={styles.joinBtn}>
            <LinearGradient
              colors={['#0066FF', '#34C759']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.joinBtnGradient}
            >
              <Text style={styles.joinBtnText}>Join Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Image 
          source={require('../../assets/images/onboarding-hero.png')} 
          style={styles.promoImage} 
          resizeMode="contain" 
        />
      </View>

      {/* How it works section */}
      <View style={styles.howItWorksSection}>
        <Text style={styles.howItWorksTitle}>How it works?</Text>
        <View style={styles.stepsRow}>
          <View style={styles.stepItem}>
            <View style={styles.stepIconCircle}>
              <Ionicons name="add" size={24} color="#34C759" />
            </View>
            <Text style={styles.stepTitle}>1. Post</Text>
            <Text style={styles.stepDesc}>Add item for free</Text>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepIconCircle}>
              <Ionicons name="people" size={24} color="#0066FF" />
            </View>
            <Text style={styles.stepTitle}>2. Connect</Text>
            <Text style={styles.stepDesc}>Chat with interested people</Text>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepIconCircle}>
              <Ionicons name="heart" size={24} color="#FF3B30" />
            </View>
            <Text style={styles.stepTitle}>3. Share</Text>
            <Text style={styles.stepDesc}>Give or receive happily</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Browse Categories</Text>
        <TouchableOpacity onPress={() => router.push('/search')}>
          <Ionicons name="search" size={24} color="#1C1C1E" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.categoryCard} 
            onPress={() => handleCategoryPress(item.name)}
          >
            <View style={styles.iconContainer}>
              <Image source={item.image} style={styles.categoryImage as any} />
            </View>
            <Text style={styles.categoryName} numberOfLines={2}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'flex-start',
    gap: '5%',
    marginBottom: 24,
  },
  categoryCard: {
    width: '30%',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
  },
  categoryImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: 12,
    color: '#1C1C1E',
    fontWeight: '600',
    textAlign: 'center',
  },
  footerContainer: {
    marginTop: 10,
  },
  promoBanner: {
    backgroundColor: '#F5F9FF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    overflow: 'hidden',
  },
  promoTextContainer: {
    flex: 1,
    zIndex: 1,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 24,
    marginBottom: 16,
  },
  joinBtn: {
    alignSelf: 'flex-start',
  },
  joinBtnGradient: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  promoImage: {
    width: 120,
    height: 120,
    position: 'absolute',
    right: -10,
    bottom: -10,
    opacity: 0.9,
  },
  howItWorksSection: {
    marginBottom: 20,
  },
  howItWorksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 20,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepItem: {
    alignItems: 'center',
    width: (width - 40) / 3, // evenly spaced
  },
  stepIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 10,
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});
