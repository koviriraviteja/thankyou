/**
 * ThankU — Search Screen
 *
 * Matches reference with recent searches, trending, and category search.
 */

import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, FlatList, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '../src/lib/supabase';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { spacing } from '../src/theme/spacing';
import { radius } from '../src/theme/radius';
import { shadows } from '../src/theme/shadows';

const RECENT_SEARCHES = ['Sofa', 'Study Table', 'Books', 'Cycle'];
const TRENDING_TAGS = ['Furniture', 'Electronics', 'Books', 'Clothing', 'Kitchen'];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (searchText: string) => {
    setQuery(searchText);
    if (searchText.length < 2) { setResults([]); return; }
    setIsSearching(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .ilike('title', `%${searchText}%`)
      .eq('is_sold', false)
      .limit(20);
    if (data) setResults(data);
    setIsSearching(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for items, categories..."
            placeholderTextColor={colors.textDisabled}
            value={query}
            onChangeText={handleSearch}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setResults([]); }}>
              <Ionicons name="close-circle" size={18} color={colors.textDisabled} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
            >
              <Image source={{ uri: item.image_url }} style={styles.resultImage} />
              <View style={styles.resultInfo}>
                <Text style={styles.resultTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.resultLocation}>{item.location?.split(',')[0]}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textDisabled} />
            </TouchableOpacity>
          )}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Recent Searches */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tagRow}>
              {RECENT_SEARCHES.map(tag => (
                <TouchableOpacity key={tag} style={styles.tag} onPress={() => handleSearch(tag)}>
                  <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Trending */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending</Text>
            <View style={styles.tagRow}>
              {TRENDING_TAGS.map(tag => (
                <TouchableOpacity key={tag} style={styles.trendingTag} onPress={() => handleSearch(tag)}>
                  <Ionicons name="trending-up" size={14} color={colors.primary} />
                  <Text style={styles.trendingTagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchHeader: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small, backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.small,
  },
  searchInputContainer: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background,
    borderRadius: radius.md, paddingHorizontal: spacing.small, borderWidth: 1,
    borderColor: colors.border, gap: spacing.tiny,
  },
  searchInput: { flex: 1, paddingVertical: spacing.small, ...typography.body, color: colors.textPrimary },
  section: { paddingHorizontal: spacing.medium, paddingTop: spacing.large },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.small },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.small },
  clearText: { ...typography.caption, color: colors.accent, fontWeight: '600' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.tiny },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.small,
    paddingVertical: spacing.tiny, borderRadius: radius.full, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
  },
  tagText: { ...typography.bodySmall, color: colors.textSecondary },
  trendingTag: {
    flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.small,
    paddingVertical: spacing.tiny, borderRadius: radius.full, backgroundColor: colors.highlight,
  },
  trendingTagText: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  resultsList: { padding: spacing.medium, gap: spacing.tiny },
  resultItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    padding: spacing.small, borderRadius: radius.md, ...shadows.sm, marginBottom: spacing.tiny,
  },
  resultImage: { width: 56, height: 56, borderRadius: radius.sm, backgroundColor: colors.highlight, marginRight: spacing.small },
  resultInfo: { flex: 1 },
  resultTitle: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '600' },
  resultLocation: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
