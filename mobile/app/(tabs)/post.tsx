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
import { LinearGradient } from 'expo-linear-gradient';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';

const CATEGORIES = ['Furniture', 'Electronics', 'Books', 'Clothing', 'Toys', 'Kitchen', 'Sports', 'Medical', 'Nature/Plants', 'Food', 'Miscellaneous'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Used'];

export default function PostAdScreen() {
  const { user } = useAuth();
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
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
    if (!title || !location || !category) {
      Alert.alert('Missing Details', 'Please fill in the title, category, and location to continue.');
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
        condition,
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
            <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
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
            <Text style={{ fontSize: 12, color: '#8E8E93', marginBottom: 12 }}>Add up to 5 photos</Text>
          </View>
          <View style={styles.photoUploadContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imagePreviewContainer}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(index)}>
                    <Ionicons name="close-circle" size={22} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))}
              {images.length < 5 && (
                <TouchableOpacity style={styles.addMoreBtn} onPress={handleImageSelect}>
                  <Ionicons name="add" size={28} color="#1C1C1E" />
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
                placeholderTextColor="#8E8E93"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category <Text style={styles.asterisk}>*</Text></Text>
              <View style={styles.dropdownContainer}>
                <TextInput
                  style={[styles.textInput, { flex: 1, borderWidth: 0, paddingHorizontal: 0, paddingVertical: 0 }]}
                  placeholder="Select Category"
                  placeholderTextColor="#8E8E93"
                  value={category}
                  onChangeText={setCategory}
                />
                <Ionicons name="chevron-down" size={20} color="#1C1C1E" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description <Text style={styles.asterisk}>*</Text></Text>
              <View style={[styles.textInput, styles.textAreaContainer]}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Describe your item.."
                  placeholderTextColor="#8E8E93"
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
              <Text style={styles.label}>Pickup Location <Text style={styles.asterisk}>*</Text></Text>
              <View style={styles.dropdownContainer}>
                <TextInput
                  style={[styles.textInput, { flex: 1, borderWidth: 0, paddingHorizontal: 0, paddingVertical: 0 }]}
                  placeholder="Hyderabad, TS"
                  placeholderTextColor="#8E8E93"
                  value={location}
                  onChangeText={setLocation}
                />
                <Ionicons name="location-outline" size={20} color="#1C1C1E" />
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
            <LinearGradient
              colors={['#0066FF', '#34C759']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[StyleSheet.absoluteFill, { borderRadius: 28 }]}
            />
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.postBtnText}>Post for FREE</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
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
    backgroundColor: '#F5F5F5',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },

  // ─── Form ────────────────────────────────────────
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  asterisk: {
    color: '#FF3B30',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1C1C1E',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  textAreaContainer: {
    height: 120,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    paddingHorizontal: 16,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  charCount: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    fontSize: 12,
    color: '#8E8E93',
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
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  pillActive: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  pillText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // ─── Location ────────────────────────────────────
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
  },
  locationTextInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#1C1C1E',
  },
  useCurrentLocationBtn: {
    padding: 4,
  },

  // ─── Footer ──────────────────────────────────────
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  postBtn: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  postBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
