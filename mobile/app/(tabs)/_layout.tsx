/**
 * ThankU — Bottom Tab Navigator
 *
 * 5 tabs: Home, Community, Donate (center), Messages, Profile
 * Uses ThankU Cyan palette, Ionicons, notification badges.
 */

import { Tabs, router, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../src/context/ThemeContext';
import { useNotification } from '../../src/context/NotificationContext';

export default function TabLayout() {
  const { colors } = useTheme();
  const { notifications, clearBadge } = useNotification();
  const insets = useSafeAreaInsets();
  
  const paddingBottom = Math.max(insets.bottom, 8);
  const tabHeight = 65 + paddingBottom;

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: {
            height: tabHeight,
            paddingBottom: paddingBottom,
            paddingTop: 8,
            backgroundColor: colors.surface,
            borderTopWidth: 0,
            elevation: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            title: 'Community',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'people' : 'people-outline'} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="post"
          options={{
            title: 'Post',
            tabBarIcon: () => <View style={{ width: 40 }} />, // Empty space for FAB
            tabBarLabel: () => null, // Hide label
          }}
          listeners={{
            tabPress: (e) => {
              router.push('/(tabs)/post');
            }
          }}
        />
        <Tabs.Screen
          name="chats"
          options={{
            title: 'Chats',
            tabBarBadge: notifications.length > 0 ? notifications.length : undefined,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} size={24} color={color} />
            ),
          }}
          listeners={{
            tabPress: () => clearBadge(),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
            ),
          }}
        />
        {/* Hide old tabs from bar */}
        <Tabs.Screen name="browse" options={{ href: null }} />
        <Tabs.Screen name="my-ads" options={{ href: null }} />
      </Tabs>
      
      {/* Center POST Button */}
      <View style={[styles.fabContainer, { bottom: paddingBottom + 5 }]} pointerEvents="box-none">
        <TouchableOpacity style={[styles.fab, { backgroundColor: colors.surface }]} onPress={() => router.push('/(tabs)/post')}>
          <View style={[styles.fabBlue, { backgroundColor: colors.primary }]}>
            <Ionicons name="add" size={32} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
        <Text style={styles.fabText}>Post</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    padding: 4, // creates the white border effect
    bottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  fabBlue: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: '#00BFA5', // colors.primary hardcoded since it's outside component
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8E8E93',
    position: 'absolute',
    bottom: 0,
  }
});
