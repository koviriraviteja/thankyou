import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#002f34',
  secondary: '#00a49f',
  bg: '#f8f9fa',
  white: '#ffffff',
  textLight: '#406367',
  border: '#d8dfe0',
};

// We will fetch real data later, using the params passed for now
export default function ProductDetailsScreen() {
  const { id, title, price, location, date, image } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="share-social-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="heart-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image Slider Placeholder */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: image as string }} style={styles.mainImage} />
          <View style={styles.imageCountBadge}>
            <Text style={styles.imageCountText}>1 / 1</Text>
          </View>
        </View>

        {/* Title and Price Block */}
        <View style={styles.detailsBlock}>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color={COLORS.textLight} />
            <Text style={styles.locationText}>{location}</Text>
            <Text style={styles.dateText}>{date}</Text>
          </View>
        </View>

        {/* Details Block */}
        <View style={styles.infoBlock}>
          <Text style={styles.sectionTitle}>Details</Text>
          <Text style={styles.descriptionText}>
            This is a fantastic product in excellent condition. Barely used, comes with all original accessories and box. Contact for more details. Price is slightly negotiable.
          </Text>
        </View>

        {/* Seller Block */}
        <View style={styles.sellerBlock}>
          <View style={styles.sellerRow}>
            <View style={styles.sellerAvatar}>
              <Ionicons name="person" size={30} color={COLORS.white} />
            </View>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>Verified Seller</Text>
              <Text style={styles.sellerDate}>Member since Nov 2022</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.chatBtn}
          onPress={() => {
            router.push({
              pathname: '/chat/[id]',
              params: {
                id: `new_chat_${id}`,
                productTitle: title,
                otherUser: 'Verified Seller',
                productImage: image
              }
            });
          }}
        >
          <Text style={styles.chatBtnText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.makeOfferBtn}>
          <Text style={styles.makeOfferBtnText}>Make offer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: COLORS.white },
  headerRight: { flexDirection: 'row', gap: 16 },
  iconBtn: { padding: 4 },
  scrollContent: { paddingBottom: 100 }, // Space for bottom bar
  imageContainer: { width: '100%', height: 300, backgroundColor: '#000' },
  mainImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imageCountBadge: { position: 'absolute', bottom: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  imageCountText: { color: COLORS.white, fontWeight: 'bold', fontSize: 12 },
  detailsBlock: { backgroundColor: COLORS.white, padding: 16, marginBottom: 8 },
  price: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary, marginBottom: 8 },
  title: { fontSize: 18, color: COLORS.textLight, marginBottom: 16, lineHeight: 24 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 12, color: COLORS.textLight, marginLeft: 4, flex: 1 },
  dateText: { fontSize: 12, color: COLORS.textLight, fontWeight: '500' },
  infoBlock: { backgroundColor: COLORS.white, padding: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginBottom: 12 },
  descriptionText: { fontSize: 14, color: COLORS.textLight, lineHeight: 22 },
  sellerBlock: { backgroundColor: COLORS.white, padding: 16, marginBottom: 8 },
  sellerRow: { flexDirection: 'row', alignItems: 'center' },
  sellerAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  sellerInfo: { flex: 1 },
  sellerName: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginBottom: 4 },
  sellerDate: { fontSize: 12, color: COLORS.textLight },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 16, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border, gap: 12 },
  chatBtn: { flex: 1, backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 4, alignItems: 'center' },
  chatBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  makeOfferBtn: { flex: 1, backgroundColor: COLORS.white, paddingVertical: 14, borderRadius: 4, alignItems: 'center', borderWidth: 2, borderColor: COLORS.primary },
  makeOfferBtnText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },
});
