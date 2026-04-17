import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
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
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house" color={color} />,
        }}
      />

      {/* 2. Lịch sử */}
      <Tabs.Screen
        name="history"
        options={{
          title: 'Lịch sử',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="clock" color={color} />,
        }}
      />

      {/* 3. Cảnh báo */}
      <Tabs.Screen
        name="notification"
        options={{
          title: 'Cảnh báo',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="bell" color={color} />, 
        }}
      />

      {/* 4. Cài đặt (Tab mới thêm) */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Cài đặt',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="gearshape" color={color} />,
        }}
      />
    </Tabs>
  );
}