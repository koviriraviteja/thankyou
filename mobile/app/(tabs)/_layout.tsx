/**
 * ThankU — Bottom Tab Navigator
 *
 * 5 tabs: Home, Community, Donate (center), Messages, Profile
 * Uses ThankU Cyan palette, Ionicons, notification badges.
 */

import { Tabs, router, useSegments, useGlobalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';
import { shadows } from '../../src/theme/shadows';
import { useNotification } from '../../src/context/NotificationContext';

const TabIcon = ({ name, focused, color, colors }: { name: any, focused: boolean, color: string, colors: any }) => (
  <View style={[
    {
      alignItems: 'center',
      justifyContent: 'center',
      width: 56,
      height: 32,
      borderRadius: 16,
    },
    { backgroundColor: focused ? colors.highlight : 'transparent' }
  ]}>
    <Ionicons name={name} size={22} color={color} />
  </View>
);

export default function TabLayout() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { notifications, clearBadge } = useNotification();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const params = useGlobalSearchParams();

  // Dynamically calculate padding and height based on the device's safe area
  const paddingBottom = Math.max(insets.bottom, 8);
  const tabHeight = 56 + paddingBottom;

  const currentTab = segments[segments.length - 1];
  let fabText = 'Donate';
  let fabIcon = 'heart';

  if (currentTab === 'community') {
    if (params.communityMode === 'help') {
      fabText = 'Help';
      fabIcon = 'hand-right';
    } else {
      fabText = 'Note';
      fabIcon = 'create';
    }
  }

  const handleFabPress = () => {
    if (currentTab === 'community') {
      if (params.communityMode === 'help') {
        router.push('/create-request');
      } else {
        router.push('/write-note');
      }
    } else {
      router.push('/(tabs)/post');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: tabHeight,
          paddingBottom: paddingBottom,
          paddingTop: 8,
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: colors.textPrimary,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} color={color} colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'people' : 'people-outline'} focused={focused} color={color} colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Messages',
          tabBarBadge: notifications.length > 0 ? notifications.length : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.gold,
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: 'bold',
          },
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'} focused={focused} color={color} colors={colors} />
          ),
        }}
        listeners={{
          tabPress: () => clearBadge(),
        }}
      />
      <Tabs.Screen
        name="my-ads"
        options={{
          title: 'My Giving',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'heart' : 'heart-outline'} focused={focused} color={color} colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} color={color} colors={colors} />
          ),
        }}
      />
      </Tabs>
      
      {/* Main FAB */}
      <View style={[styles.fabWrapper, { bottom: tabHeight + 20 }]}>
        <TouchableOpacity 
          style={styles.fab} 
          onPress={handleFabPress}
        >
          <Ionicons name={fabIcon as any} size={26} color={colors.textOnPrimary} />
        </TouchableOpacity>
        <Text style={styles.fabText}>{fabText}</Text>
      </View>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  fabWrapper: {
    position: 'absolute',
    right: 20,
    alignItems: 'center',
    zIndex: 100,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
    marginBottom: 4,
  },
  fabText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
