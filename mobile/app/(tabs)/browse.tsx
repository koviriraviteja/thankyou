import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';

const { width } = Dimensions.get('window');

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

export default function CategoriesScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);

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
          <TouchableOpacity style={[styles.joinBtn, { backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999 }]}>
            <Text style={styles.joinBtnText}>Join Now</Text>
          </TouchableOpacity>
        </View>
        <Image 
          source={require('../../assets/images/family_illustration.png')} 
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
              <Ionicons name="add" size={24} color={colors.secondary} />
            </View>
            <Text style={styles.stepTitle}>1. Post</Text>
            <Text style={styles.stepDesc}>Add item for free</Text>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepIconCircle}>
              <Ionicons name="people" size={24} color={colors.primary} />
            </View>
            <Text style={styles.stepTitle}>2. Connect</Text>
            <Text style={styles.stepDesc}>Chat with interested people</Text>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepIconCircle}>
              <Ionicons name="heart" size={24} color="#FF2D55" />
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.canGoBack() ? router.back() : router.navigate('/(tabs)/')}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Browse Categories</Text>
        <TouchableOpacity onPress={() => router.push('/search')}>
          <Ionicons name="search" size={24} color={colors.textPrimary} />
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
            <View style={[styles.iconContainer, { borderColor: 'transparent', backgroundColor: colors.primaryLight }]}>
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

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
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
    backgroundColor: '#F0FDF8',
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
