import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const COLORS = {
  primary: '#002f34',
  secondary: '#00a49f',
  bg: '#ffffff',
  gray: '#f2f4f5',
  textLight: '#406367',
  border: '#d8dfe0',
};

const RECENT_SEARCHES = ['iPhone 13', 'Honda City', 'PS5 Console', 'Office Chair'];
const POPULAR_CATEGORIES = ['Cars', 'Properties', 'Mobiles', 'Jobs'];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Find Cars, Mobile Phones and more..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Popular Categories</Text>
        <View style={styles.chipContainer}>
          {POPULAR_CATEGORIES.map(cat => (
            <TouchableOpacity key={cat} style={styles.chip}>
              <Text style={styles.chipText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Recent Searches</Text>
        <FlatList
          data={RECENT_SEARCHES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.recentItem}>
              <Ionicons name="time-outline" size={20} color={COLORS.textLight} />
              <Text style={styles.recentText}>{item}</Text>
              <Ionicons name="arrow-up-left" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { padding: 8, marginRight: 8 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.gray, borderRadius: 4, paddingHorizontal: 12, paddingVertical: 8 },
  searchInput: { flex: 1, fontSize: 16, color: COLORS.primary },
  content: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginBottom: 12 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8 },
  chipText: { fontSize: 14, color: COLORS.primary },
  recentItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.gray },
  recentText: { flex: 1, fontSize: 16, color: COLORS.primary, marginLeft: 12 },
});
