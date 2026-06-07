import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/context/AuthContext';

const COLORS = {
  primary: '#002f34',
  secondary: '#00a49f',
  bg: '#f8f9fa',
  white: '#ffffff',
  textLight: '#406367',
  border: '#d8dfe0',
};

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*') 
      .eq('id', id)
      .single();
    
    // Fallback: If we can't fetch the seller details easily via join because it's auth.users, we just display "Verified Seller" for now.
    if (data) {
      setProduct(data);
    } else {
      console.error('Error fetching product:', error);
    }
    setLoading(false);
  };

  const startChat = async () => {
    if (!user) {
      alert('Please log in to chat with the seller.');
      return;
    }
    if (user.id === product.seller_id) {
      alert('You cannot chat with yourself.');
      return;
    }

    try {
      // Check if a chat already exists between these two users for this product
      const { data: existingChats, error: fetchError } = await supabase
        .from('chats')
        .select('*')
        .eq('product_id', product.id)
        .eq('buyer_id', user.id);

      let chatId;

      if (existingChats && existingChats.length > 0) {
        chatId = existingChats[0].id;
      } else {
        // Create new chat room
        const { data: newChat, error: createError } = await supabase
          .from('chats')
          .insert({
            product_id: product.id,
            buyer_id: user.id,
            seller_id: product.seller_id
          })
          .select()
          .single();
        
        if (createError) throw createError;
        chatId = newChat.id;
      }

      router.push({
        pathname: '/chat/[id]',
        params: {
          id: chatId,
          productTitle: product.title,
          otherUser: 'Verified Seller',
          productImage: product.image_url
        }
      });
    } catch (err) {
      console.error('Error starting chat:', err);
      alert('Could not start chat.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Product not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const dateStr = new Date(product.created_at).toLocaleDateString();

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
          <Image source={{ uri: product.image_url }} style={styles.mainImage} />
          <View style={styles.imageCountBadge}>
            <Text style={styles.imageCountText}>1 / 1</Text>
          </View>
        </View>

        {/* Title and Price Block */}
        <View style={styles.detailsBlock}>
          <Text style={styles.price}>{product.price}</Text>
          <Text style={styles.title}>{product.title}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color={COLORS.textLight} />
            <Text style={styles.locationText}>{product.location}</Text>
            <Text style={styles.dateText}>{dateStr}</Text>
          </View>
        </View>

        {/* Details Block */}
        <View style={styles.infoBlock}>
          <Text style={styles.sectionTitle}>Details</Text>
          <Text style={styles.descriptionText}>
            {product.description || 'No description provided.'}
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
              <Text style={styles.sellerDate}>User ID: {product.seller_id?.substring(0, 8)}...</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.chatBtn} onPress={startChat}>
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
