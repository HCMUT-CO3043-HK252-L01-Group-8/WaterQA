import { Card } from "@/components/ui/Card";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function ProfileCard() {
    return (
        <Card style={styles.profileCard}>
            <View style={styles.avatarBox}>
                <Feather name="user" size={24} color="#007595" />
            </View>
            <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Đậu Minh Khôi</Text>
                <Text style={styles.profileEmail}>khoidau123@gmail.com</Text>
                <View style={styles.verifyBadge}>
                    <Text style={styles.verifyText}>Người dùng đã xác minh</Text>
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ECFEFF",
        borderWidth: 0,
    },
    avatarBox: {
        width: 56,
        height: 56,
        backgroundColor: "#A2F4FD",
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
        borderWidth: 2,
        borderColor: "#007595",
    },
    profileInfo: { flex: 1 },
    profileName: { fontSize: 14, color: "#0F172B", marginBottom: 2, fontFamily: "Inter-SemiBold" },
    profileEmail: { fontSize: 12, color: "#45556C", marginBottom: 6, fontFamily: "Inter-Regular" },
    verifyBadge: {
        backgroundColor: "#CBFBF1",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: "flex-start",
    },
    verifyText: { fontSize: 10, color: "#00786F", fontFamily: "Inter-SemiBold" },
});
