import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

export default function WelcomeScreen() {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <ImageBackground
            source={require("@/assets/images/Welcome.png")}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{t("auth.welcome", "Welcome")}</Text>
                        <Text style={styles.subtitle}>
                            {t("auth.welcomeSubtitle", "Chào mừng bạn đến với")}{" "}
                            <Text style={styles.registerLink}>WaterQA</Text>
                        </Text>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/login")}>
                            <Text style={styles.primaryButtonText}>{t("auth.loginBtn", "Đăng nhập")}</Text>
                        </TouchableOpacity>

                        <View style={styles.registerContainer}>
                            <Text style={styles.registerText}>{t("auth.newCustomer", "Khách hàng mới? ")}</Text>
                            <TouchableOpacity onPress={() => router.push("/register")}>
                                <Text style={styles.registerLink}>{t("auth.createAccount", "Tạo tài khoản")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: { flex: 1, width: "100%", height: "100%" },
    safeArea: { flex: 1, backgroundColor: "transparent" },
    container: { flex: 1, paddingHorizontal: 24, justifyContent: "space-between" },
    header: { marginTop: 100 },
    title: { fontSize: 52, fontWeight: "bold", color: "#00A89D", marginBottom: 8 },
    subtitle: { fontSize: 16, color: "#666" },
    footer: { marginBottom: 120 },
    primaryButton: {
        backgroundColor: "#00A89D",
        borderRadius: 8,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },
    primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
    registerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    registerText: { fontSize: 14, color: "#333" },
    registerLink: { fontSize: 14, color: "#00A89D", fontWeight: "600" },
});
