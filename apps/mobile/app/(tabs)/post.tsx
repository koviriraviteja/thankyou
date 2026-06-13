/**
 * ThankU — Donate Item Screen
 *
 * Matches Reference Images with ThankU branding.
 * Features: Category selection, photo upload, AI-friendly form,
 * condition pills, transportation tag, location auto-detect.
 */

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
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { shadows } from '../../src/theme/shadows';
import { Button } from '../../src/components/ui/Button';

const CATEGORIES = ['Furniture', 'Electronics', 'Books', 'Clothing', 'Toys', 'Kitchen', 'Sports', 'Medical', 'Nature/Plants', 'Food', 'Miscellaneous'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Used'];
const TRANSPORT_TAGS = ['Fits in a bag', 'Fits in a sedan', 'Needs a truck'];

export default function PostAdScreen() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [condition, setCondition] = useState('Good');
  const [transportTag, setTransportTag] = useState('');
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
      selectionLimit: 12 - images.length,
      quality: 0.8,
    });
    if (!result.canceled) setImages([...images, ...result.assets.map(a => a.uri)]);
  };

  const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index));

  const handlePost = async () => {
    if (!title || !location) {
      Alert.alert('Missing Details', 'Please fill in the title and location to continue.');
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
      Alert.alert('Item Posted! 🎉', 'Your donation is now live. You\'re awesome!', [
        {
          text: 'View My Donations',
          onPress: () => {
            setStep(1);
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

  // ─── Step 1: Category Selection ────────────────────
  if (step === 1) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>What are you donating?</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView style={styles.content}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={styles.categoryItem}
              onPress={() => { setCategory(cat); setStep(2); }}
            >
              <View style={styles.categoryItemIcon}>
                <Ionicons name="folder-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.categoryText}>{cat}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Step 2: Item Details ──────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep(1)}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Include some details</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 140 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Photo Upload */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Photos (up to 12)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
              {images.length < 12 && (
                <TouchableOpacity style={styles.uploadBtn} onPress={handleImageSelect}>
                  <Ionicons name="camera-outline" size={28} color={colors.primary} />
                  <Text style={styles.uploadBtnText}>Add</Text>
                </TouchableOpacity>
              )}
              {images.map((uri, index) => (
                <View key={index} style={styles.imagePreviewContainer}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(index)}>
                    <Ionicons name="close-circle" size={22} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Title *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="What are you giving away?"
              placeholderTextColor={colors.textDisabled}
              value={title}
              onChangeText={setTitle}
              maxLength={70}
            />
            <Text style={styles.charCount}>{title.length}/70</Text>
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Share the story of this item. Why are you giving it away?"
              placeholderTextColor={colors.textDisabled}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={4000}
            />
            <Text style={styles.charCount}>{description.length}/4000</Text>
          </View>

          {/* Condition */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Condition</Text>
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

          {/* Transportation Tag */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Transportation Needed</Text>
            <View style={styles.pillRow}>
              {TRANSPORT_TAGS.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.pill, transportTag === t && styles.pillActive]}
                  onPress={() => setTransportTag(t)}
                >
                  <Text style={[styles.pillText, transportTag === t && styles.pillTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location *</Text>
            <View style={styles.locationInput}>
              <Ionicons name="location" size={18} color={colors.primary} />
              <TextInput
                style={styles.locationTextInput}
                placeholder="e.g. Anna Nagar, Chennai"
                placeholderTextColor={colors.textDisabled}
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.footer}>
          <Button
            title="Post Donation"
            onPress={handlePost}
            loading={isLoading}
            disabled={isLoading}
            icon={<Ionicons name="heart" size={20} color={colors.textOnPrimary} />}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    ...typography.h3,
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.medium,
    paddingTop: spacing.medium,
  },

  // ─── Categories ──────────────────────────────────
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  categoryItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.small,
  },
  categoryText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },

  // ─── Form ────────────────────────────────────────
  inputGroup: {
    marginBottom: spacing.large,
  },
  inputLabel: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.tiny,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.medium,
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    ...typography.caption,
    color: colors.textDisabled,
    alignSelf: 'flex-end',
    marginTop: spacing.micro,
  },

  // ─── Pills ───────────────────────────────────────
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.tiny,
  },
  pill: {
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.tiny,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  pillTextActive: {
    color: colors.textOnPrimary,
    fontWeight: '600',
  },

  // ─── Images ──────────────────────────────────────
  imageRow: {
    flexDirection: 'row',
    marginTop: spacing.tiny,
  },
  uploadBtn: {
    width: 90,
    height: 90,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.small,
    backgroundColor: colors.background,
  },
  uploadBtnText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  imagePreviewContainer: {
    marginRight: spacing.small,
    position: 'relative',
  },
  imagePreview: {
    width: 90,
    height: 90,
    borderRadius: radius.md,
    backgroundColor: colors.highlight,
  },
  removeImageBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },

  // ─── Location ────────────────────────────────────
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.medium,
    backgroundColor: colors.background,
    gap: spacing.tiny,
  },
  locationTextInput: {
    flex: 1,
    paddingVertical: spacing.medium,
    ...typography.body,
    color: colors.textPrimary,
  },

  // ─── Footer ──────────────────────────────────────
  footer: {
    padding: spacing.medium,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
