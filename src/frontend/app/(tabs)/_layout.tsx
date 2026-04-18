import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons'; // 1. Thêm import thư viện icon chuẩn của Expo

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      
      {/* 1. Trang chủ */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="home" color={color} />, // 2. Đổi sang Ionicons
        }}
      />

      {/* 2. Lịch sử */}
      <Tabs.Screen
        name="history"
        options={{
          title: 'Lịch sử',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="time-outline" color={color} />,
        }}
      />

      {/* 3. Cảnh báo */}
      <Tabs.Screen
        name="notification"
        options={{
          title: 'Cảnh báo',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="notifications-outline" color={color} />, 
        }}
      />

      {/* 4. Cài đặt */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Cài đặt',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="settings-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}