import { useColorScheme } from "@/hooks/use-color-scheme";
import * as InterFonts from "@expo-google-fonts/inter";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { store } from "@/store/store"; 

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
    anchor: "(tabs)",
};

export default function RootLayout() {
    const colorScheme = useColorScheme();

    const [loaded, error] = useFonts({
        "Inter-Regular": InterFonts.Inter_400Regular,
        "Inter-Medium": InterFonts.Inter_500Medium,
        "Inter-SemiBold": InterFonts.Inter_600SemiBold,
        "Inter-Bold": InterFonts.Inter_700Bold,
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
        <Provider store={store}>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="welcome" options={{ headerShown: false }} />
                    <Stack.Screen name="login" options={{ headerShown: false, animation: "ios_from_right" }} />
                    <Stack.Screen name="register" options={{ headerShown: false, animation: "ios_from_right" }} />
                    <Stack.Screen name="forgot-password" options={{ headerShown: false, animation: "ios_from_right" }} />

                    <Stack.Screen
                        name="verify-code"
                        options={{ presentation: "transparentModal", headerShown: false, animation: "fade_from_bottom" }}
                    />

                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
                <StatusBar style="auto" />
            </ThemeProvider>
        </Provider>
    );
}