import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView,
  Platform, KeyboardAvoidingView, ActivityIndicator, Alert, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import { supabase } from '../../src/lib/supabase';
import { useTheme } from '../../src/context/ThemeContext';

const CATEGORY_MAP: Record<string, string[]> = {
  'Furniture': ['Seating (Sofas, Chairs, Recliners)', 'Tables (Dining, Coffee, Desks)', 'Storage (Wardrobes, Cabinets)', 'Beds & Mattresses'],
  'Electronics': ['Mobile & Accessories', 'Computers & Laptops', 'Home Appliances (ACs, Washers)', 'Entertainment (TVs, Gaming)'],
  'Books': ['Educational & Textbooks', 'Fiction', 'Non-Fiction', 'Children\'s Books & Comics'],
  'Clothing': ['Men\'s Wear', 'Women\'s Wear', 'Kids & Babies', 'Accessories & Footwear'],
  'Toys': ['Infant/Toddler Play', 'Action Figures & Dolls', 'Educational & Puzzles', 'Outdoor (Bicycles, Ride-ons)'],
  'Kitchen': ['Cookware', 'Tableware', 'Storage Containers', 'Small Appliances'],
  'Sports': ['Fitness Gear (Dumbbells, Mats)', 'Racket Sports', 'Team Sports', 'Outdoor & Camping Gear'],
  'Medical': ['Monitoring Devices (Oximeters)', 'Mobility Aids (Wheelchairs)', 'Supplies (First Aid Kits)', 'Support & Braces'],
  'Nature/Plants': ['Indoor Plants', 'Outdoor/Garden Plants', 'Supplies (Planters, Soil)', 'Seeds & Cuttings'],
  'Food': ['Cooked/Event Leftovers (Time Sensitive)', 'Fresh Vegetables & Fruits', 'Non-Perishables (Canned, Grains)', 'Packaged Snacks', 'Beverages'],
  'Miscellaneous (Other)': ['Art & Craft Supplies', 'Musical Instruments', 'Pet Supplies', 'Stationery']
};

const CATEGORIES = Object.keys(CATEGORY_MAP);
const CONDITIONS = ['New', 'Like New', 'Good', 'Used'];

export default function PostAdScreen() {
  const { user } = useAuth();
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);
  
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [transportation, setTransportation] = useState('');
  const [expiryTime, setExpiryTime] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [condition, setCondition] = useState('Good');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      try {
        let loc = await Location.getCurrentPositionAsync({});
        setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        let geocode = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        if (geocode.length > 0) {
          const { city, region, country } = geocode[0];
          setLocation(`${city || region}, ${country}`);
        }
      } catch (e) {
        console.error('Location error:', e);
      }
    })();
  }, []);

  const handleImageSelect = () => {
    Alert.alert('Add Photo', 'Choose a photo source', [
      { text: 'Camera', onPress: takePhoto },
      { text: 'Gallery', onPress: pickImageFromLibrary },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission Required', 'Camera access is needed to take photos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled) setImages([...images, ...result.assets.map(a => a.uri)]);
  };

  const pickImageFromLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission Required', 'Photo library access is needed.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 5 - images.length,
      quality: 0.8,
    });
    if (!result.canceled) setImages([...images, ...result.assets.map(a => a.uri)]);
  };

  const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index));

  const handlePost = async () => {
    if (!title || !location || !category || !subcategory || !transportation) {
      Alert.alert('Missing Details', 'Please fill in all required fields (marked with *).');
      return;
    }
    if (category === 'Food' && !expiryTime) {
      Alert.alert('Missing Expiry', 'Food items require a specific consume-by or expiry time.');
      return;
    }
    if (!user) {
      Alert.alert('Sign In Required', 'You must be signed in to donate an item.');
      return;
    }
    setIsLoading(true);
    try {
      const uploadedUrls: string[] = [];
      let mainImageUrl = '';
      for (let i = 0; i < images.length; i++) {
        try {
          const base64 = await FileSystem.readAsStringAsync(images[i], { encoding: 'base64' });
          const filePath = `${user.id}/${Date.now()}-${i}.jpg`;
          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, decode(base64), { contentType: 'image/jpeg' });
          if (uploadError) throw uploadError;
          const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
          uploadedUrls.push(publicUrlData.publicUrl);
          if (i === 0) mainImageUrl = publicUrlData.publicUrl;
        } catch (err) {
          console.error('Image upload failed:', err);
        }
      }

      const { error: dbError } = await supabase.from('products').insert({
        title,
        description,
        price: 'Free',
        location,
        latitude: coords?.lat || null,
        longitude: coords?.lng || null,
        category,
        subcategory,
        condition,
        transportation,
        expiry_time: expiryTime || null,
        image_url: mainImageUrl || 'https://via.placeholder.com/300',
        image_urls: uploadedUrls,
        seller_id: user.id,
      });
      if (dbError) throw dbError;

      setIsLoading(false);
      Alert.alert('Item Posted! 🎉', 'Your donation is now live.', [
        {
          text: 'View My Donations',
          onPress: () => {
            setImages([]);
            setTitle('');
            setDescription('');
            setCategory('');
            setSubcategory('');
            setTransportation('');
            setExpiryTime('');
            setCondition('Good');
            router.push('/(tabs)/my-ads');
          },
        },
      ]);
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Error', error.message || 'Failed to post item.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post an Item</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 140 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Photo Upload */}
          <View>
            <Text style={[styles.label, { marginBottom: 4, marginTop: 12 }]}>Add Photos</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 12 }}>Add up to 5 photos</Text>
          </View>
          <View style={styles.photoUploadContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imagePreviewContainer}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(index)}>
                    <Ionicons name="close-circle" size={22} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
              {images.length < 5 && (
                <TouchableOpacity style={styles.addMoreBtn} onPress={handleImageSelect}>
                  <Ionicons name="add" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          {/* Form Fields */}
          <View style={{ marginTop: 0 }}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Item Title <Text style={styles.asterisk}>*</Text></Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ex: Study Table"
                placeholderTextColor={colors.textSecondary}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category <Text style={styles.asterisk}>*</Text></Text>
              <View style={styles.dropdownContainer}>
                <TextInput
                  style={[styles.textInput, { flex: 1, borderWidth: 0, paddingHorizontal: 0, paddingVertical: 0 }]}
                  placeholder="Select Category (e.g. Furniture, Electronics)"
                  placeholderTextColor={colors.textSecondary}
                  value={category}
                  onChangeText={(val) => { setCategory(val); setSubcategory(''); }}
                />
                <Ionicons name="chevron-down" size={20} color={colors.textPrimary} />
              </View>
            </View>

            {category && CATEGORY_MAP[category] && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Subcategory <Text style={styles.asterisk}>*</Text></Text>
                <View style={styles.dropdownContainer}>
                  <TextInput
                    style={[styles.textInput, { flex: 1, borderWidth: 0, paddingHorizontal: 0, paddingVertical: 0 }]}
                    placeholder="Select specific subtype"
                    placeholderTextColor={colors.textSecondary}
                    value={subcategory}
                    onChangeText={setSubcategory}
                  />
                  <Ionicons name="chevron-down" size={20} color={colors.textPrimary} />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description <Text style={styles.asterisk}>*</Text></Text>
              <View style={[styles.textInput, styles.textAreaContainer]}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Describe your item.."
                  placeholderTextColor={colors.textSecondary}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                />
                <Text style={styles.charCount}>{description.length}/500</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Condition</Text>
              <View style={styles.pillRow}>
                {CONDITIONS.map(c => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.pill, condition === c && styles.pillActive]}
                    onPress={() => setCondition(c)}
                  >
                    <Text style={[styles.pillText, condition === c && styles.pillTextActive]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Transportation / Logistics <Text style={styles.asterisk}>*</Text></Text>
              <View style={styles.dropdownContainer}>
                <TextInput
                  style={[styles.textInput, { flex: 1, borderWidth: 0, paddingHorizontal: 0, paddingVertical: 0 }]}
                  placeholder="e.g. Fits in a car, Needs a truck"
                  placeholderTextColor={colors.textSecondary}
                  value={transportation}
                  onChangeText={setTransportation}
                />
                <Ionicons name="car-outline" size={20} color={colors.textPrimary} />
              </View>
            </View>

            {category === 'Food' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Expiry Time / Consume By <Text style={styles.asterisk}>*</Text></Text>
                <View style={styles.dropdownContainer}>
                  <TextInput
                    style={[styles.textInput, { flex: 1, borderWidth: 0, paddingHorizontal: 0, paddingVertical: 0 }]}
                    placeholder="e.g. Consume by 8:00 PM tonight"
                    placeholderTextColor={colors.textSecondary}
                    value={expiryTime}
                    onChangeText={setExpiryTime}
                  />
                  <Ionicons name="time-outline" size={20} color={colors.textPrimary} />
                </View>
                <Text style={{ fontSize: 12, color: colors.error, marginTop: 6, fontStyle: 'italic' }}>
                  Required for food safety. Please be specific.
                </Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pickup Location <Text style={styles.asterisk}>*</Text></Text>
              <View style={styles.dropdownContainer}>
                <TextInput
                  style={[styles.textInput, { flex: 1, borderWidth: 0, paddingHorizontal: 0, paddingVertical: 0 }]}
                  placeholder="Hyderabad, TS"
                  placeholderTextColor={colors.textSecondary}
                  value={location}
                  onChangeText={setLocation}
                />
                <Ionicons name="location-outline" size={20} color={colors.textPrimary} />
              </View>
            </View>
          </View>

        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.postBtn, isLoading && { opacity: 0.7 }]} 
            onPress={handlePost} 
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.textOnPrimary} />
            ) : (
              <Text style={styles.postBtnText}>Post for FREE</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: colors.background,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
    marginTop: 8,
  },
  
  // ─── Photos ────────────────────────────────────────
  photoUploadContainer: {
    marginBottom: 20,
  },
  imageRow: {
    flexDirection: 'row',
  },
  addMoreBtn: {
    width: 72,
    height: 72,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: isDark ? colors.highlight : '#F5F5F5',
  },
  imagePreviewContainer: {
    marginRight: 12,
    position: 'relative',
  },
  imagePreview: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  removeImageBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },

  // ─── Form ────────────────────────────────────────
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  asterisk: {
    color: colors.error,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surface,
  },
  textAreaContainer: {
    height: 120,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingHorizontal: 16,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  charCount: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    fontSize: 12,
    color: colors.textSecondary,
  },

  // ─── Pills ───────────────────────────────────────
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  pillTextActive: {
    color: colors.textOnPrimary,
    fontWeight: 'bold',
  },

  // ─── Location ────────────────────────────────────
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    marginBottom: 24,
  },
  locationTextInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    fontSize: 14,
    color: colors.textPrimary,
  },
  useCurrentLocationBtn: {
    padding: 4,
  },

  // ─── Footer ──────────────────────────────────────
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  postBtn: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    overflow: 'hidden',
  },
  postBtnText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
