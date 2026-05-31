import ProfileCard from "@/components/settings/ProfileCard";
import StatsCard from "@/components/settings/StatsCard";
import ThresholdModal from "@/components/settings/ThresholdModal";
import AppHeader from "@/components/ui/AppHeader";
import Card from "@/components/ui/Card";
import CustomFilterTab from "@/components/ui/CustomFilterTab";
import SettingRow from "@/components/ui/SettingRow";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { authServices } from "@/services/authServices";
import { useDispatch } from "react-redux";
import { logoutClient } from "@/store/slices/authSlice";

export default function SettingsScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const tabBarHeight = useTabBarHeight();
    const { t, i18n } = useTranslation();
    const [user, setUser] = useState({ name: "", email: "", role: "user" });
    const [emailNotification, setEmailNotification] = useState(true);
    const [language, setLanguage] = useState(i18n.language || "vi");
    const [personalThreshold, setPersonalThreshold] = useState(80);
    const [isModalVisible, setModalVisible] = useState(false);
    const adminDefault = 75;

    const languageOptions = [
        { label: t("settings.Vietnamese", "Tiếng Việt"), value: "vi" },
        { label: t("settings.English", "English"), value: "en" },
    ];

    useEffect(() => {
        const loadProfileData = async () => {
            try {
                const storedUserStr = await AsyncStorage.getItem("currentUser");
                if (storedUserStr) {
                    const storedUser = JSON.parse(storedUserStr);
                    setUser({
                        name: storedUser.name || "Người dùng",
                        email: storedUser.email || "",
                        role: storedUser.role || "user",
                    });
                }
            } catch (e) {
                console.error("Lỗi đọc bộ nhớ cục bộ:", e);
            }

            try {
                const response = await authServices.getMe();
                if (response.success && response.payload) {
                    const payload = response.payload;
                    setEmailNotification(payload.email_notifications);

                    const updatedUser = {
                        name: payload.name,
                        email: payload.email,
                        role: (payload as any).role || "user",
                    };

                    setUser(updatedUser);
                    await AsyncStorage.setItem("currentUser", JSON.stringify(updatedUser));
                }
            } catch (error) {
                console.error("Lỗi đồng bộ dữ liệu tài khoản từ Server:", error);
            }
        };

        loadProfileData();
    }, []);

    const handleToggleEmailNotif = async (value: boolean) => {
        setEmailNotification(value);
        try {
            const res = await authServices.updateEmailNotifications(value);
            if (!res.success) {
                Alert.alert(t("common.error", "Lỗi"), "Không thể cập nhật thiết lập thông báo.");
                setEmailNotification(!value);
            }
        } catch (error) {
            console.error("Error in SETTINGS:", error);
            Alert.alert(t("common.error", "Lỗi"), "Vui lòng kiểm tra kết nối internet.");
            setEmailNotification(!value);
        }
    };

    const handleLanguageChange = (val: string) => {
        setLanguage(val);
        if (i18n && typeof i18n.changeLanguage === "function") {
            i18n.changeLanguage(val);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            t("settings.logoutConfirmText", "Đăng xuất"),
            t("settings.confirmLogout", "Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?"),
            [
                { text: t("settings.cancel", "Hủy"), style: "cancel" },
                {
                    text: t("common.logout", "Đăng xuất"),
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await authServices.logout();
                        } catch (e) {
                            console.error("Lỗi gọi API logout:", e);
                        } finally {
                            dispatch(logoutClient()); // xóa auth state trong Redux
                            await AsyncStorage.removeItem("currentUser");
                            router.replace("/login");
                        }
                    },
                },
            ],
        );
    };

    const openFAQ = () => Linking.openURL("https://github.com/HCMUT-CO3043-HK252-L01-Group-8/WaterQA");

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
            >
                <View style={styles.header}>
                    <AppHeader />
                    <View style={styles.pageTitleSection}>
                        <Text style={styles.pageTitle}>{t("settings.title", "Cài đặt")}</Text>
                        <Text style={styles.pageSubtitle}>
                            {t("settings.subtitle", "Điều chỉnh theo sở thích cá nhân của bạn")}
                        </Text>
                    </View>
                </View>

                <ProfileCard name={user.name} email={user.email} />

                <StatsCard />

                {user.role === "admin" && (
                    <Card style={{ borderColor: "#0891B2" }}>
                        <Text style={[styles.sectionTitle, { color: "#0891B2" }]}>Quản trị viên</Text>
                        <SettingRow
                            iconName="cpu"
                            title="Quản lý thiết bị IoT"
                            subtitle="Thêm, xóa, sửa các trạm quan trắc"
                        />
                        <SettingRow
                            iconName="users"
                            title="Quản lý người dùng"
                            subtitle="Phê duyệt và phân quyền tài khoản"
                            isLast
                        />
                    </Card>
                )}

                <Card>
                    <Text style={styles.sectionTitle}>{t("settings.alerts", "Cài đặt cảnh báo")}</Text>
                    <SettingRow
                        iconName="bell"
                        title={t("settings.wqiThreshold", "Ngưỡng cảnh báo WQI")}
                        subtitle={t("settings.thresholdSubtitle", "Mức an toàn cá nhân của bạn")}
                        rightElement={
                            <TouchableOpacity style={styles.thresholdBtn} onPress={() => setModalVisible(true)}>
                                <Text style={styles.thresholdValue}>{personalThreshold}</Text>
                                <Feather name="edit-2" size={14} color="#0891B2" />
                            </TouchableOpacity>
                        }
                        isLast
                    />
                </Card>

                <Card>
                    <Text style={styles.sectionTitle}>{t("settings.general", "Cài đặt chung")}</Text>
                    <SettingRow
                        iconName="user"
                        title={t("settings.profileInfo", "Thông tin cá nhân")}
                        subtitle={t("common.profile", "Quản lý thông tin tài khoản")}
                    />
                    <SettingRow
                        iconName="mail"
                        title={t("settings.notifications", "Nhận thông báo qua email")}
                        subtitle={t("settings.notificationsSubtitle", "Cho phép gửi thông báo qua email")}
                        isToggle={true}
                        toggleValue={emailNotification}
                        onToggle={handleToggleEmailNotif}
                        isLast
                    />
                </Card>

                <Card>
                    <Text style={styles.sectionTitle}>{t("settings.system", "Cài đặt hệ thống")}</Text>
                    <SettingRow
                        iconName="map-pin"
                        title={t("settings.stations", "Danh sách trạm quan trắc")}
                        subtitle={t("settings.stationsSubtitle", "Hiển thị vị trí và thông tin các trạm")}
                    />
                    <SettingRow
                        iconName="settings"
                        title={t("settings.manageStations", "Quản lý trạm của bạn")}
                        subtitle={t("settings.manageStationsSubtitle", "Quản lý trạm quan trắc của bạn")}
                        isLast
                    />
                </Card>

                <Card>
                    <Text style={styles.sectionTitle}>{t("settings.support", "Hỗ trợ & Hệ thống")}</Text>
                    <SettingRow
                        iconName="help-circle"
                        title={t("settings.faq", "FAQ")}
                        subtitle={t("settings.faqSubtitle", "Nhận trợ giúp về ứng dụng")}
                        onPress={openFAQ}
                    />
                    <SettingRow
                        iconName="globe"
                        title={t("common.language", "Ngôn ngữ")}
                        subtitle={t("settings.changeLanguage", "Thay đổi ngôn ngữ hiển thị")}
                        rightElement={
                            <CustomFilterTab
                                options={languageOptions}
                                activeOption={language}
                                onOptionChange={handleLanguageChange}
                            />
                        }
                    />
                    <SettingRow
                        iconName="log-out"
                        title={t("common.logout", "Đăng xuất")}
                        subtitle={t("common.logoutSubtitle", "Đăng xuất khỏi tài khoản của bạn")}
                        onPress={handleLogout}
                        isLast
                    />

                    <ThresholdModal
                        isVisible={isModalVisible}
                        onClose={() => setModalVisible(false)}
                        currentValue={personalThreshold}
                        adminDefault={adminDefault}
                        onSave={setPersonalThreshold}
                    />
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
    container: { flex: 1, backgroundColor: "#FFFFFF" },
    header: { padding: 16 },
    pageTitleSection: { marginTop: 5 },
    pageTitle: { fontSize: 24, color: "#0F172B", marginBottom: 4, fontFamily: "Inter-SemiBold" },
    pageSubtitle: { fontSize: 12, color: "#45556C", fontFamily: "Inter-Regular" },
    sectionTitle: { fontSize: 14, color: "#0F172B", marginBottom: 16, fontFamily: "Inter-SemiBold" },
    thresholdBtn: { flexDirection: "row", alignItems: "center" },
    thresholdValue: { fontSize: 14, color: "#0F172B", marginRight: 4, fontFamily: "Inter-SemiBold" },
});
