import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from '@/hooks/use-color-scheme';

// 1. Import toàn bộ kiểu font Inter vào một object
import * as InterFonts from '@expo-google-fonts/inter'; 
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // 2. Đăng ký các kiểu font bạn muốn sử dụng từ object InterFonts
  const [loaded, error] = useFonts({
    'Inter-Regular': InterFonts.Inter_400Regular,
    'Inter-Medium': InterFonts.Inter_500Medium,
    'Inter-SemiBold': InterFonts.Inter_600SemiBold,
    'Inter-Bold': InterFonts.Inter_700Bold, // Bây giờ bạn có thể dùng Bold thoải mái
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Giữ nguyên các Screen của bạn */}
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="verify-code" options={{ presentation: 'transparentModal', headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}