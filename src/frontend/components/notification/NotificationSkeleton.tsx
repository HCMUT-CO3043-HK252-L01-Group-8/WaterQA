import AppHeader from "@/components/ui/AppHeader";
import { SkeletonBlock, SkeletonContainer } from "@/components/ui/Skeleton";
import AntDesign from "@expo/vector-icons/AntDesign";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationSkeleton() {
    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
            <View style={styles.header}>
                <AppHeader />
                <View style={styles.pageTitleSection}>
                    <Text style={styles.pageTitle}>Cảnh báo</Text>
                    <View style={styles.unreadContainer}>
                        <AntDesign name="bell" size={14} color="#94A3B8" />
                        <Text style={styles.unreadBadge}>Đang tải dữ liệu...</Text>
                    </View>
                </View>
            </View>

            <SkeletonContainer style={{ flex: 1, paddingHorizontal: 16 }}>
                <SkeletonBlock style={{ height: 260, marginBottom: 20 }} />

                <View style={styles.filterRow}>
                    <SkeletonBlock style={{ width: 50, height: 20 }} />
                    <SkeletonBlock style={{ width: 180, height: 32 }} />
                </View>

                <View style={styles.alertList}>
                    {[1, 2, 3].map((item) => (
                        <View key={item} style={styles.alertCard}>
                            <SkeletonBlock style={styles.iconBox} />
                            <View style={{ flex: 1 }}>
                                <SkeletonBlock style={[styles.textBar, { width: "70%", height: 14 }]} />
                                <SkeletonBlock style={[styles.textBar, { width: "100%", height: 12 }]} />
                                <SkeletonBlock
                                    style={[styles.textBar, { width: "85%", height: 12, marginBottom: 12 }]}
                                />
                                <View style={styles.actionRow}>
                                    <SkeletonBlock style={{ width: 60, height: 24, backgroundColor: "#CBD5E1" }} />
                                    <SkeletonBlock style={{ width: 90, height: 24, backgroundColor: "#CBD5E1" }} />
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </SkeletonContainer>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
    header: { padding: 16 },
    pageTitleSection: { marginTop: 5, flexDirection: "row", justifyContent: "space-between" },
    pageTitle: { fontSize: 24, color: "#0F172B", fontFamily: "Inter-SemiBold" },
    unreadContainer: { flexDirection: "row", alignItems: "center" },
    unreadBadge: { fontSize: 13, color: "#94A3B8", fontFamily: "Inter-SemiBold", marginLeft: 7 },

    filterRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
    alertList: { gap: 12 },
    alertCard: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    iconBox: { width: 44, height: 44, backgroundColor: "#CBD5E1", marginRight: 12 },
    textBar: { backgroundColor: "#CBD5E1", marginBottom: 6 },
    actionRow: { flexDirection: "row", gap: 12 },
});
