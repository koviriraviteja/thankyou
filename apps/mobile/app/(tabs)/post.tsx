import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { supabase } from '../../src/lib/supabase';

const COLORS = {
  primary: '#002f34',
  secondary: '#00a49f',
  bg: '#ffffff',
  gray: '#f2f4f5',
  textLight: '#406367',
  border: '#d8dfe0',
};

export default function PostAdScreen() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  
  // Form State
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
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
          longitude: loc.coords.longitude
        });
        
        if (geocode.length > 0) {
          const { city, region, country } = geocode[0];
          setLocation(`${city || region}, ${country}`);
        }
      } catch (e) {
        console.error('Error fetching location on post screen', e);
      }
    })();
  }, []);

  const categories = ['Cars', 'Properties', 'Mobiles', 'Jobs', 'Bikes', 'Electronics', 'Furniture'];

  const pickImage = async () => {
    // Request permission first
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 12 - images.length,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handlePost = async () => {
    if (!title || !price || !location) {
      Alert.alert('Error', 'Please fill all mandatory fields');
      return;
    }
    if (!user) {
      Alert.alert('Error', 'You must be logged in to post an ad.');
      return;
    }
    
    setIsLoading(true);

    try {
      // 1. Upload Images to Supabase Storage
      const uploadedUrls: string[] = [];
      let mainImageUrl = '';

      for (let i = 0; i < images.length; i++) {
        const uri = images[i];
        try {
          const response = await fetch(uri);
          const blob = await response.blob();
          const filePath = `${user.id}/${Date.now()}-${i}.jpg`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, blob, {
              contentType: 'image/jpeg',
            });

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          uploadedUrls.push(publicUrlData.publicUrl);
          if (i === 0) mainImageUrl = publicUrlData.publicUrl; // Use first image as main
        } catch (err) {
          console.error('Image upload failed:', err);
        }
      }

      // 2. Insert Product into Database
      const { error: dbError } = await supabase
        .from('products')
        .insert({
          title,
          description,
          price: `₹${price}`,
          location,
          latitude: coords?.lat || null,
          longitude: coords?.lng || null,
          category,
          image_url: mainImageUrl || 'https://via.placeholder.com/300',
          image_urls: uploadedUrls,
          seller_id: user.id,
        });

      if (dbError) throw dbError;

      setIsLoading(false);
      Alert.alert('Success', 'Your Ad has been posted successfully!', [
        { text: 'OK', onPress: () => {
            setStep(1);
            setImages([]);
            setTitle('');
            setDescription('');
            setPrice('');
            setLocation('');
            setCategory('');
            router.push('/(tabs)/my-ads');
        }}
      ]);
    } catch (error: any) {
      setIsLoading(false);
      console.error('Post Ad Error:', error);
      Alert.alert('Error', error.message || 'Failed to post ad.');
    }
  };

  if (step === 1) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>What are you offering?</Text>
          <View style={{ width: 28 }} />
        </View>
        <ScrollView style={styles.content}>
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat} 
              style={styles.categoryItem}
              onPress={() => {
                setCategory(cat);
                setStep(2);
              }}
            >
              <Text style={styles.categoryText}>{cat}</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep(1)}>
            <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Include some details</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
          
          {/* Photo Upload Section */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Upload up to 12 photos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
              <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
                <Ionicons name="camera" size={32} color={COLORS.primary} />
                <Text style={styles.uploadBtnText}>Add photo</Text>
              </TouchableOpacity>
              
              {images.map((uri, index) => (
                <View key={index} style={styles.imagePreviewContainer}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(index)}>
                    <Ionicons name="close-circle" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ad title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Key features of your item"
              value={title}
              onChangeText={setTitle}
              maxLength={70}
            />
            <Text style={styles.charCount}>{title.length} / 70</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Include condition, features and reason for selling"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={4000}
            />
            <Text style={styles.charCount}>{description.length} / 4000</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price *</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.currencyPrefix}>₹</Text>
              <TextInput
                style={styles.priceInput}
                placeholder=""
                value={price}
                onChangeText={(text) => setPrice(text.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Indiranagar, Bangalore"
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitBtn} onPress={handlePost} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.submitBtnText}>Post now</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  content: { flex: 1, padding: 16 },
  categoryItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  categoryText: { fontSize: 16, color: COLORS.primary },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, color: COLORS.primary, marginBottom: 8, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, padding: 12, fontSize: 16, color: COLORS.primary },
  textArea: { height: 100, textAlignVertical: 'top' },
  charCount: { alignSelf: 'flex-end', fontSize: 12, color: COLORS.textLight, marginTop: 4 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, paddingHorizontal: 12 },
  currencyPrefix: { fontSize: 18, color: COLORS.primary, marginRight: 8, fontWeight: 'bold' },
  priceInput: { flex: 1, paddingVertical: 12, fontSize: 18, color: COLORS.primary },
  
  // Image Upload Styles
  imageScroll: { flexDirection: 'row', marginTop: 8 },
  uploadBtn: { width: 100, height: 100, borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  uploadBtnText: { fontSize: 12, color: COLORS.primary, marginTop: 4, fontWeight: 'bold' },
  imagePreviewContainer: { marginRight: 12, position: 'relative' },
  imagePreview: { width: 100, height: 100, borderRadius: 8, backgroundColor: COLORS.gray },
  removeImageBtn: { position: 'absolute', top: -8, right: -8, backgroundColor: COLORS.white, borderRadius: 12 },

  footer: { padding: 16, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.bg },
  submitBtn: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 4, alignItems: 'center' },
  submitBtnText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});
