import { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authServices } from "@/services/authServices";
import { useDispatch } from "react-redux";
import { setCredentials, logoutClient } from "@/store/slices/authSlice";
import { useTranslation } from "react-i18next";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const { t } = useTranslation();

    const redirectUri = Platform.select({
        android: __DEV__ ? "host.exp.exponent://oauthredirect" : undefined,
        ios: __DEV__ ? "host.exp.exponent://oauthredirect" : undefined,
        default: AuthSession.makeRedirectUri({
            scheme: "frontend",
        }),
    });

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
        scopes: ["openid", "profile", "email"],
        redirectUri,
    });

    useEffect(() => {
        if (response?.type === "success") {
            handleGoogleSuccess(response);
        } else if (response?.type === "error") {
            setGoogleLoading(false);
            Alert.alert("Lỗi", "Đăng nhập Google thất bại: " + (response.error?.message || "Không xác định"));
        } else if (response?.type === "dismiss") {
            setGoogleLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response]);

    const decodeIdToken = (idToken: string) => {
        try {
            const parts = idToken.split(".");
            if (parts.length !== 3) return null;
            const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
            const padded = payload + "==".slice((payload.length + 3) % 4 === 0 ? 4 : (payload.length + 3) % 4);
            return JSON.parse(atob(padded));
        } catch {
            return null;
        }
    };

    const handleGoogleSuccess = async (successResponse: AuthSession.AuthSessionResult) => {
        if (successResponse.type !== "success") return;

        try {
            const tokenResponse = (successResponse as any).authentication;
            const accessToken = tokenResponse?.accessToken;
            const idToken = (successResponse as any).params?.id_token || tokenResponse?.idToken;

            let userInfo: { name?: string; email?: string; picture?: string } | null = null;

            if (accessToken) {
                const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                userInfo = await userInfoResponse.json();
            } else if (idToken) {
                const decoded = decodeIdToken(idToken);
                if (decoded) userInfo = { name: decoded.name, email: decoded.email, picture: decoded.picture };
            }

            if (userInfo?.email) {
                const backendResponse = await authServices.loginWithGoogle(
                    userInfo.name || "Google User",
                    userInfo.email,
                    userInfo.picture || "",
                );

                if (backendResponse.success) {
                    // Dùng user từ response login trực tiếp, không chờ getMe() (tránh lỗi cross-origin cookie)
                    const loginUser = (backendResponse as any).user || {};
                    dispatch(setCredentials({ user: loginUser }));
                    await AsyncStorage.setItem("currentUser", JSON.stringify(loginUser));
                    router.dismissAll();
                    router.replace("/(tabs)/home");
                    // Fetch full profile in background
                    authServices.getMe().then(p => {
                        if (p.success && p.payload) {
                            AsyncStorage.setItem("currentUser", JSON.stringify(p.payload));
                            dispatch(setCredentials({ user: p.payload }));
                        }
                    }).catch(() => {});
                } else {
                    Alert.alert(t("common.error", "Lỗi"), backendResponse.error || "Failed");
                }
            } else {
                Alert.alert(t("common.error", "Lỗi"), "Google Login Failed");
            }
        } catch (error) {
            console.error("Error in LOGIN:", error);
            Alert.alert(t("common.error", "Lỗi"), "Google Login Failed");
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (!process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID) {
            Alert.alert("Thiếu cấu hình", "Vui lòng thêm EXPO_PUBLIC_GOOGLE_CLIENT_ID vào file .env.local");
            return;
        }
        if (!request) return;

        setGoogleLoading(true);
        try {
            await promptAsync();
        } catch (error) {
            setGoogleLoading(false);
            console.error("Error in LOGIN:", error);
            Alert.alert("Lỗi", "Không thể mở trang đăng nhập Google.");
        }
    };

    const handleLogin = async () => {
        if (!email.trim() || !password) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ email và mật khẩu");
            return;
        }

        setLoading(true);
        try {
            const res = await authServices.login(email.trim(), password);

            if (res.success) {
                // Dùng user từ login response trực tiếp — không phụ thuộc vào getMe() cross-origin
                const loginUser = (res as any).user || {};
                if (rememberMe) await AsyncStorage.setItem("rememberedUser", JSON.stringify(loginUser));
                else await AsyncStorage.removeItem("rememberedUser");
                await AsyncStorage.setItem("currentUser", JSON.stringify(loginUser));
                dispatch(setCredentials({ user: loginUser }));
                router.dismissAll();
                router.replace("/(tabs)/home");
                // Fetch full profile in background (email_notifications, phone, etc.)
                authServices.getMe().then(p => {
                    if (p.success && p.payload) {
                        AsyncStorage.setItem("currentUser", JSON.stringify(p.payload));
                        dispatch(setCredentials({ user: p.payload }));
                    }
                }).catch(() => {});
            } else {
                Alert.alert(t("common.error", "Lỗi"), res.error || "Failed");
            }
        } catch (error: any) {
            console.error("Error in LOGIN:", error);
            Alert.alert(t("common.error", "Lỗi"), error?.error || "Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                        disabled={loading || googleLoading}
                    >
                        <View style={styles.backIconCircle}>
                            <Ionicons name="chevron-back" size={20} color="#333" />
                        </View>
                        <Text style={styles.backText}>{t('common.back', 'Quay lại')}</Text>
                    </TouchableOpacity>

                    <View style={styles.headerSection}>
                        <Text style={styles.title}>{t('auth.loginTitle', 'Đăng nhập')}</Text>
                        <Text style={styles.subtitle}>{t('auth.loginSubtitle', 'Đăng nhập vào tài khoản của bạn')}</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.inputLabel}>{t('common.email', 'Email')}</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder={t('auth.emailPlaceholder', 'Nhập email')}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!loading && !googleLoading}
                            />
                            {email.length > 0 && (
                                <Ionicons name="checkmark-circle" size={20} color="#00A89D" style={styles.icon} />
                            )}
                        </View>

                        <Text style={styles.inputLabel}>{t('auth.passwordLabel', 'Mật khẩu')}</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                placeholder={t('auth.passwordPlaceholder', '••••••••')}
                                secureTextEntry={!showPassword}
                                editable={!loading && !googleLoading}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? "eye" : "eye-off"}
                                    size={20}
                                    color="#999"
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={() => router.push("/forgot-password")}
                            disabled={loading || googleLoading}
                        >
                            <Text style={styles.forgotPasswordText}>{t('auth.forgotPasswordLink', 'Quên mật khẩu?')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.rememberMeContainer}
                            onPress={() => setRememberMe(!rememberMe)}
                            activeOpacity={0.7}
                            disabled={loading || googleLoading}
                        >
                            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                {rememberMe && <Ionicons name="checkmark" size={14} color="#FFF" />}
                            </View>
                            <Text style={styles.rememberMeText}>{t('auth.rememberMe', 'Ghi nhớ đăng nhập')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.loginButton, loading && { opacity: 0.7 }]}
                            onPress={handleLogin}
                            disabled={loading || googleLoading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.loginButtonText}>{t('auth.loginBtn', 'Đăng nhập')}</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.socialContainer}>
                        <View style={styles.dividerRow}>
                            <View style={styles.line} />
                            <Text style={styles.dividerText}>{t('auth.orLoginWith', 'Hoặc đăng nhập với')}</Text>
                            <View style={styles.line} />
                        </View>

                        <TouchableOpacity
                            style={[styles.googleButton, googleLoading && { opacity: 0.7, backgroundColor: "#F5F8F8" }]}
                            onPress={handleGoogleLogin}
                            disabled={loading || googleLoading || !request}
                        >
                            {googleLoading ? (
                                <ActivityIndicator size="small" color="#DB4437" />
                            ) : (
                                <FontAwesome5 name="google" size={18} color="#DB4437" />
                            )}
                            <Text style={styles.googleButtonText}>
                                {googleLoading ? t('auth.openingGoogle', 'Đang mở Google...') : t('auth.loginWithGoogle', 'Đăng nhập với Google')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
    scrollContainer: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 10, paddingBottom: 30 },
    backButton: { flexDirection: "row", alignItems: "center", marginBottom: 30, alignSelf: "flex-start" },
    backIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#F5F5F5",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    backText: { fontSize: 16, fontWeight: "500", color: "#333" },
    headerSection: { marginBottom: 32 },
    title: { fontSize: 48, fontWeight: "bold", color: "#00A89D", marginBottom: 8 },
    subtitle: { fontSize: 14, color: "#666" },
    formContainer: { width: "100%" },
    inputLabel: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F8F8",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 16,
        height: 52,
    },
    input: { flex: 1, height: "100%", color: "#333", fontSize: 15 },
    icon: { marginLeft: 10 },
    forgotPasswordText: { color: "#00A89D", textAlign: "right", fontSize: 14, fontWeight: "600", marginBottom: 16 },
    rememberMeContainer: { flexDirection: "row", alignItems: "center", marginBottom: 24, gap: 10 },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: "#00A89D",
        justifyContent: "center",
        alignItems: "center",
    },
    checkboxChecked: { backgroundColor: "#00A89D" },
    rememberMeText: { fontSize: 14, color: "#333", fontWeight: "500" },
    loginButton: {
        backgroundColor: "#00A89D",
        borderRadius: 10,
        height: 52,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#00A89D",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    loginButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
    socialContainer: { marginTop: 10 },
    dividerRow: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
    line: { flex: 1, height: 1, backgroundColor: "#EEEEEE" },
    dividerText: { marginHorizontal: 16, color: "#999", fontSize: 13 },
    googleButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 10,
        height: 52,
        backgroundColor: "#FFFFFF",
    },
    googleButtonText: { color: "#333", fontSize: 15, fontWeight: "600", marginLeft: 12 },
});
