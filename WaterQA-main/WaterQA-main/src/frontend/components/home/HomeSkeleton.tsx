import AppHeader from "@/components/ui/AppHeader";
import { SkeletonBlock, SkeletonContainer } from "@/components/ui/Skeleton";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

interface HomeSkeletonProps {
    userName: string;
}

export default function HomeSkeleton({ userName }: HomeSkeletonProps) {
    const { t } = useTranslation();

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
            <View style={styles.header}>
                <AppHeader />
                <View style={styles.greetingSection}>
                    <Text style={styles.greetingTitle}>
                        {t("home.greeting", "Xin chào, ").replace("{{name}}", "")}
                        <Text style={styles.userName}>{userName}</Text>
                    </Text>
                    <Text style={styles.greetingSubtitle}>
                        {t("home.greetingSubtitle", "Hãy kiểm tra chất lượng nước của bạn")}
                    </Text>
                </View>
            </View>

            <SkeletonContainer style={styles.container}>
                <SkeletonBlock style={{ height: 60 }} />
                <SkeletonBlock style={{ height: 200 }} />

                <View style={{ flexDirection: "row", gap: 14 }}>
                    <SkeletonBlock style={{ flex: 1, height: 80 }} />
                    <SkeletonBlock style={{ flex: 1, height: 80 }} />
                </View>

                <SkeletonBlock style={{ height: 150 }} />
            </SkeletonContainer>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
    header: { padding: 16 },
    greetingSection: { marginBottom: 4 },
    greetingTitle: { fontSize: 20, color: "#0F172B", marginBottom: 4, fontFamily: "Inter-Regular" },
    userName: { fontFamily: "Inter-Bold" },
    greetingSubtitle: { fontSize: 13, color: "#45556C", fontFamily: "Inter-Regular" },
    container: { flex: 1, paddingHorizontal: 16, gap: 20 },
});
