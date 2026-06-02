import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
    RefreshControl,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { authServices } from "@/services/authServices";
import { useTranslation } from "react-i18next";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";

export default function ManageUsersScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const tabBarHeight = useTabBarHeight();

    const [users, setUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await authServices.getAllAccounts();
            if (response.success && response.payload) {
                setUsers(response.payload);
            }
        } catch (error) {
            console.error("Lỗi tải danh sách người dùng:", error);
            Alert.alert(t("common.error", "Lỗi"), "Không thể tải danh sách người dùng.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchUsers();
    };

    const handleDeleteUser = (userId: number, email: string) => {
        const confirmMsg = t("admin.confirmDeleteUser", "Bạn có chắc chắn muốn xóa tài khoản {{email}} không?").replace("{{email}}", email);
        
        const performDelete = async () => {
            try {
                const res = await authServices.deleteAccount(userId);
                if (res.success || !res) {
                    if (Platform.OS !== "web") {
                        Alert.alert(t("common.success", "Thành công"), t("admin.deleteSuccess", "Đã xóa tài khoản thành công"));
                    } else {
                        window.alert(t("admin.deleteSuccess", "Đã xóa tài khoản thành công"));
                    }
                    setUsers((prev) => prev.filter((u) => u.user_id !== userId));
                } else {
                    if (Platform.OS !== "web") Alert.alert(t("common.error", "Lỗi"), res.error || "Không thể xóa người dùng này.");
                    else window.alert(res.error || "Không thể xóa người dùng này.");
                }
            } catch (error) {
                console.error("Error in MANAGE USERS:", error)
                if (Platform.OS !== "web") Alert.alert(t("common.error", "Lỗi"), "Lỗi kết nối máy chủ.");
                else window.alert("Lỗi kết nối máy chủ.");
            }
        };

        if (Platform.OS === "web") {
            if (window.confirm(confirmMsg)) {
                performDelete();
            }
        } else {
            Alert.alert(
                t("admin.deleteUser", "Xóa tài khoản"),
                confirmMsg,
                [
                    { text: t("common.cancel", "Hủy"), style: "cancel" },
                    { text: t("common.delete", "Xóa"), style: "destructive", onPress: performDelete },
                ]
            );
        }
    };

    const filteredUsers = users.filter((u) => {
        const query = searchQuery.toLowerCase();
        return u.name?.toLowerCase().includes(query) || u.email?.toLowerCase().includes(query);
    });

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <View style={styles.backIconCircle}>
                        <Ionicons name="chevron-back" size={20} color="#333" />
                    </View>
                </TouchableOpacity>
                <View style={styles.titleWrapper}>
                    <Text style={styles.pageTitle}>{t("admin.manageUsers", "Quản lý người dùng")}</Text>
                    <Text style={styles.pageSubtitle}>
                        {t("admin.manageUsersSubtitle", "Danh sách tài khoản hệ thống")}
                    </Text>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <Feather name="search" size={18} color="#94A3B8" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={t("admin.searchUser", "Tìm kiếm theo tên hoặc email...")}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <Feather name="x-circle" size={18} color="#94A3B8" />
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <View style={styles.centerBox}>
                    <ActivityIndicator size="large" color="#00A89D" />
                </View>
            ) : (
                <ScrollView
                    style={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#00A89D"]} />
                    }
                >
                    {filteredUsers.length === 0 ? (
                        <View style={styles.emptyBox}>
                            <Feather name="users" size={32} color="#CBD5E1" style={{ marginBottom: 12 }} />
                            <Text style={styles.emptyText}>
                                {t("admin.noUsersFound", "Không tìm thấy người dùng nào.")}
                            </Text>
                        </View>
                    ) : (
                        filteredUsers.map((user) => {
                            const isAdmin = user.role?.toLowerCase() === "admin";
                            const isVerified = user.verification_status === 1;

                            return (
                                <View key={user.user_id} style={styles.userCard}>
                                    <View style={styles.avatarBox}>
                                        <Text style={styles.avatarText}>
                                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                        </Text>
                                    </View>

                                    <View style={styles.userInfo}>
                                        <Text style={styles.userName} numberOfLines={1}>
                                            {user.name}
                                        </Text>
                                        <Text style={styles.userEmail} numberOfLines={1}>
                                            {user.email}
                                        </Text>

                                        <View style={styles.badgesRow}>
                                            <View
                                                style={[styles.badge, isAdmin ? styles.badgeAdmin : styles.badgeUser]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.badgeText,
                                                        isAdmin ? styles.badgeAdminText : styles.badgeUserText,
                                                    ]}
                                                >
                                                    {isAdmin
                                                        ? t("admin.roleAdmin", "Quản trị viên")
                                                        : t("admin.roleUser", "Người dùng")}
                                                </Text>
                                            </View>
                                            <View
                                                style={[
                                                    styles.badge,
                                                    isVerified ? styles.badgeVerified : styles.badgeUnverified,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.badgeText,
                                                        isVerified
                                                            ? styles.badgeVerifiedText
                                                            : styles.badgeUnverifiedText,
                                                    ]}
                                                >
                                                    {isVerified
                                                        ? t("admin.statusVerified", "Đã xác minh")
                                                        : t("admin.statusUnverified", "Chưa xác minh")}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    {!isAdmin && (
                                        <TouchableOpacity
                                            style={styles.deleteBtn}
                                            onPress={() => handleDeleteUser(user.user_id, user.email)}
                                        >
                                            <Feather name="trash-2" size={18} color="#EF4444" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            );
                        })
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 16,
        backgroundColor: "#FFFFFF",
    },
    backButton: { marginRight: 16 },
    backIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#F1F5F9",
        justifyContent: "center",
        alignItems: "center",
    },
    titleWrapper: { flex: 1 },
    pageTitle: { fontSize: 20, color: "#0F172B", fontFamily: "Inter-SemiBold", marginBottom: 2 },
    pageSubtitle: { fontSize: 13, color: "#64748B", fontFamily: "Inter-Regular" },

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        margin: 16,
        paddingHorizontal: 14,
        height: 46,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 14, color: "#0F172B", fontFamily: "Inter-Regular", height: "100%" },

    centerBox: { flex: 1, justifyContent: "center", alignItems: "center" },
    listContainer: { flex: 1, paddingHorizontal: 16 },

    emptyBox: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
    emptyText: { color: "#94A3B8", fontSize: 14, fontFamily: "Inter-Regular" },

    userCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    avatarBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#E0F2FE",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
        borderWidth: 1,
        borderColor: "#BAE6FD",
    },
    avatarText: { fontSize: 18, color: "#0284C7", fontFamily: "Inter-Bold" },
    userInfo: { flex: 1 },
    userName: { fontSize: 15, color: "#0F172B", fontFamily: "Inter-SemiBold", marginBottom: 2 },
    userEmail: { fontSize: 13, color: "#64748B", fontFamily: "Inter-Regular", marginBottom: 8 },

    badgesRow: { flexDirection: "row", gap: 8 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    badgeText: { fontSize: 10, fontFamily: "Inter-SemiBold" },

    badgeAdmin: { backgroundColor: "#EFF6FF" },
    badgeAdminText: { color: "#2563EB" },
    badgeUser: { backgroundColor: "#F1F5F9" },
    badgeUserText: { color: "#475569" },

    badgeVerified: { backgroundColor: "#F0FDF4" },
    badgeVerifiedText: { color: "#16A34A" },
    badgeUnverified: { backgroundColor: "#FEF2F2" },
    badgeUnverifiedText: { color: "#DC2626" },

    deleteBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FEF2F2",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
    },
});
