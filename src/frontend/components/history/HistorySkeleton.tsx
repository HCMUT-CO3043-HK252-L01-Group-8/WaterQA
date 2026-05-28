import AppHeader from "@/components/ui/AppHeader";
import { SkeletonBlock, SkeletonContainer } from "@/components/ui/Skeleton";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistorySkeleton() {
    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
            <View style={styles.header}>
                <AppHeader />
                <Text style={styles.pageTitle}>Lịch sử quan trắc</Text>
            </View>

            <SkeletonContainer style={{ flex: 1, paddingHorizontal: 16 }}>
                <SkeletonBlock style={{ height: 50, marginBottom: 20 }} />

                <View style={{ flexDirection: "row", gap: 14, marginBottom: 24 }}>
                    <SkeletonBlock style={{ flex: 1, height: 85 }} />
                    <SkeletonBlock style={{ flex: 1, height: 85 }} />
                </View>

                <SkeletonBlock style={{ height: 210, marginBottom: 20 }} />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
                    <SkeletonBlock style={{ width: 150, height: 32 }} />
                    <SkeletonBlock style={{ width: 110, height: 32 }} />
                </View>

                <View style={{ flex: 1, padding: 14 }}>
                    {[1, 2, 3, 4].map((item) => (
                        <View key={item} style={styles.historyRow}>
                            <View style={styles.rowLeft}>
                                <SkeletonBlock style={styles.iconSkeleton} />
                                <View>
                                    <SkeletonBlock
                                        style={{ width: 60, height: 14, marginBottom: 6, backgroundColor: "#CBD5E1" }}
                                    />
                                    <SkeletonBlock style={{ width: 80, height: 10, backgroundColor: "#CBD5E1" }} />
                                </View>
                            </View>
                            <View style={styles.rowRight}>
                                <SkeletonBlock
                                    style={{ width: 40, height: 14, marginBottom: 6, backgroundColor: "#CBD5E1" }}
                                />
                                <SkeletonBlock style={{ width: 50, height: 10, backgroundColor: "#CBD5E1" }} />
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
    pageTitle: { fontSize: 24, color: "#0F172B", fontFamily: "Inter-SemiBold" },

    historyRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
    rowLeft: { flexDirection: "row", alignItems: "center" },
    iconSkeleton: { width: 35, height: 35, borderRadius: 12, marginRight: 10, backgroundColor: "#CBD5E1" },
    rowRight: { alignItems: "flex-end", justifyContent: "center" },
});
