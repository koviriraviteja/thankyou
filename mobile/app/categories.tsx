import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import { typography } from '../src/theme/typography';
import { spacing } from '../src/theme/spacing';
import { shadows } from '../src/theme/shadows';

import { Image } from 'react-native';

const CATEGORIES = [
  { id: '1', name: 'Furniture', image: require('../assets/images/categories/furniture.png') },
  { id: '2', name: 'Electronics', image: require('../assets/images/categories/electronics.png') },
  { id: '3', name: 'Books', image: require('../assets/images/categories/books.png') },
  { id: '4', name: 'Clothing', image: require('../assets/images/categories/clothing.png') },
  { id: '5', name: 'Toys', image: require('../assets/images/categories/toys.png') },
  { id: '6', name: 'Kitchen', image: require('../assets/images/categories/kitchen.png') },
  { id: '7', name: 'Sports', image: require('../assets/images/categories/sports.png') },
  { id: '8', name: 'Medical', image: require('../assets/images/categories/medical.png') },
  { id: '9', name: 'Nature/Plants', image: require('../assets/images/categories/plants.png') },
  { id: '10', name: 'Food', image: require('../assets/images/categories/food.png') },
  { id: '11', name: 'Miscellaneous', image: require('../assets/images/categories/misc.png') },
];

export default function CategoriesScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const handleCategoryPress = (categoryName: string) => {
    // Navigate back to the home feed and pass the selected category
    router.navigate({
      pathname: '/(tabs)/',
      params: { category: categoryName }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Categories</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.categoryCard} 
            onPress={() => handleCategoryPress(item.name)}
          >
            <View style={styles.iconContainer}>
              <Image source={item.image} style={styles.categoryImage} />
            </View>
            <Text style={styles.categoryName} numberOfLines={2} adjustsFontSizeToFit>
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
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.tiny,
    marginLeft: -spacing.tiny,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  listContent: {
    padding: spacing.medium,
    paddingTop: spacing.large,
    paddingBottom: spacing.xxl,
  },
  row: {
    justifyContent: 'flex-start',
    gap: '5%',
    marginBottom: spacing.xl,
  },
  categoryCard: {
    width: '30%',
    alignItems: 'center',
  },
  iconContainer: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.small,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.sm,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryName: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
});
