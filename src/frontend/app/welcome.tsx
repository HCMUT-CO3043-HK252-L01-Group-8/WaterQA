import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <ImageBackground
            source={require("@/assets/images/Welcome.png")}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>

                    <View style={styles.header}>
                        <Text style={styles.title}>Chào mừng</Text>
                        <Text style={styles.subtitle}>Chào mừng bạn đến với WaterOA</Text>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.label}>Đã có tài khoản</Text>
                        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/login")}>
                            <Text style={styles.primaryButtonText}>Đăng nhập</Text>
                        </TouchableOpacity>

                        <View style={styles.registerContainer}>
                            <Text style={styles.registerText}>Khách hàng mới? </Text>
                            <TouchableOpacity onPress={() => router.push("/register")}>
                                <Text style={styles.registerLink}>Tạo tài khoản</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    safeArea: { flex: 1, backgroundColor: "transparent" },
    container: { flex: 1, paddingHorizontal: 24, justifyContent: "space-between" },
    header: { marginTop: 100 },
    title: { fontSize: 36, fontWeight: "bold", color: "#00A89D", marginBottom: 8 },
    subtitle: { fontSize: 16, color: "#666" },
    footer: { marginBottom: 50 },
    label: { fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 12 },
    primaryButton: {
        backgroundColor: "#00A89D",
        borderRadius: 8,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },
    primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
    registerContainer: { flexDirection: "row", alignItems: "center" },
    registerText: { fontSize: 14, color: "#333" },
    registerLink: { fontSize: 14, color: "#00A89D", fontWeight: "600" },
});
