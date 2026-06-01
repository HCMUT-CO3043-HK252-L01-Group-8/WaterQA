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
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, Platform } from "react-native";
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
    const [thresholds, setThresholds] = useState({
        wqi: 80,
        ph: 6.5,
        ntu: 5.0,
        clo: 0.5,
    });
    const [activeModal, setActiveModal] = useState<"wqi" | "ph" | "ntu" | "clo" | null>(null);
    const languageOptions = [
        { label: t("settings.Vietnamese", "Tiếng Việt"), value: "vi" },
        { label: t("settings.English", "English"), value: "en" },
    ];

    useEffect(() => {
        const loadSettingsData = async () => {
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

                const storedLang = await AsyncStorage.getItem("appLanguage");
                if (storedLang) setLanguage(storedLang);

                const storedThresholds = await AsyncStorage.getItem("personalThresholds");
                if (storedThresholds) setThresholds(JSON.parse(storedThresholds));
            } catch (e) {
                console.error("Lỗi đọc cài đặt cục bộ:", e);
            }

            try {
                const response = await authServices.getMe();
                if (response.success && response.payload) {
                    const payload = response.payload;
                    setEmailNotification(Boolean(payload.email_notifications));

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

        loadSettingsData();
    }, []);

    const handleToggleEmailNotification = async (value: boolean) => {
        setEmailNotification(value);
        try {
            const res = await authServices.updateEmailNotifications(value);
            if (!res.success) {
                Alert.alert(t("common.error", "Lỗi"), "Không thể cập nhật thiết lập thông báo trên máy chủ.");
                setEmailNotification(!value);
            }
        } catch (error) {
            console.error("Error in SETTINGS:", error);
            Alert.alert(t("common.error", "Lỗi"), "Vui lòng kiểm tra kết nối internet.");
            setEmailNotification(!value);
        }
    };

    const handleLanguageChange = async (val: string) => {
        setLanguage(val);
        if (i18n && typeof i18n.changeLanguage === "function") {
            i18n.changeLanguage(val);
        }
        try {
            await AsyncStorage.setItem("appLanguage", val);
        } catch (e) {
            console.error("Lỗi lưu ngôn ngữ:", e);
        }
    };

    const handleSaveThreshold = async (value: number) => {
        if (!activeModal) return;
        const newThresholds = { ...thresholds, [activeModal]: value };
        setThresholds(newThresholds);
        try {
            await AsyncStorage.setItem("personalThresholds", JSON.stringify(newThresholds));
        } catch (e) {
            console.error("Lỗi lưu ngưỡng cá nhân:", e);
        }
    };

    const getModalConfig = () => {
        switch (activeModal) {
            case "wqi":
                return {
                    title: t("sensorNames.wqi", "Chỉ số WQI"),
                    unit: "WQI",
                    min: 0,
                    max: 100,
                    step: 1,
                    val: thresholds.wqi,
                    default: 75,
                };
            case "ph":
                return {
                    title: t("sensorNames.ph", "Độ pH"),
                    unit: "pH",
                    min: 0,
                    max: 14,
                    step: 0.1,
                    val: thresholds.ph,
                    default: 6.5,
                };
            case "ntu":
                return {
                    title: t("sensorNames.ntu", "Độ đục"),
                    unit: "NTU",
                    min: 0,
                    max: 20,
                    step: 0.5,
                    val: thresholds.ntu,
                    default: 5.0,
                };
            case "clo":
                return {
                    title: t("sensorNames.clo", "Clo"),
                    unit: "mg/l",
                    min: 0,
                    max: 5,
                    step: 0.1,
                    val: thresholds.clo,
                    default: 0.5,
                };
            default:
                return { title: "", unit: "", min: 0, max: 100, step: 1, val: 0, default: 0 };
        }
    };
    const modalConfig = getModalConfig();

    const handleLogout = () => {
        Alert.alert(
            t("settings.logoutConfirmText", "Xác nhận đăng xuất"),
            t("settings.confirmLogout", "Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?"),
            [
                { text: t("common.cancel", "Hủy"), style: "cancel" },
                {
                    text: t("common.logout", "Đăng xuất"),
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await authServices.logout();
                        } catch (e) {
                            console.error("Lỗi gọi API logout:", e);
                        } finally {
                            await AsyncStorage.removeItem("currentUser");
                            dispatch(logoutClient());

                            if (Platform.OS === "web") {
                                window.location.href = "/login";
                            } else {
                                router.replace("/login");
                            }
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
                            title={t("iotManagement.title", "Quản lý hệ thống IoT")}
                            subtitle={t("iotManagement.subtitle", "Quản lý thiết bị và ngưỡng cảnh báo máy chủ")}
                            onPress={() => router.push("/manage-iot")}
                        />
                        <SettingRow
                            iconName="users"
                            title={t("admin.manageUsers", "Quản lý người dùng")}
                            subtitle={t("admin.manageUsersSubtitle", "Danh sách tất cả tài khoản trong hệ thống")}
                            onPress={() => router.push("/manage-users")}
                            isLast
                        />
                    </Card>
                )}

                <Card>
                    <Text style={styles.sectionTitle}>{t("settings.alerts", "Cài đặt cảnh báo cá nhân")}</Text>

                    <SettingRow
                        iconName="activity"
                        title={t("sensorNames.wqi", "Chỉ số WQI")}
                        subtitle={t("settings.thresholdDesc", "Cảnh báo khi dưới mức an toàn")}
                        rightElement={
                            <TouchableOpacity style={styles.thresholdBtn} onPress={() => setActiveModal("wqi")}>
                                <Text style={styles.thresholdValue}>{thresholds.wqi}</Text>
                                <Feather name="edit-2" size={14} color="#0891B2" />
                            </TouchableOpacity>
                        }
                    />
                    <SettingRow
                        iconName="droplet"
                        title={t("sensorNames.ph", "Độ pH")}
                        subtitle={t("settings.thresholdDesc", "Cảnh báo khi vượt ngưỡng")}
                        rightElement={
                            <TouchableOpacity style={styles.thresholdBtn} onPress={() => setActiveModal("ph")}>
                                <Text style={styles.thresholdValue}>{thresholds.ph}</Text>
                                <Feather name="edit-2" size={14} color="#0891B2" />
                            </TouchableOpacity>
                        }
                    />
                    <SettingRow
                        iconName="eye-off"
                        title={t("sensorNames.ntu", "Độ đục (NTU)")}
                        subtitle={t("settings.thresholdDesc", "Cảnh báo khi vượt ngưỡng")}
                        rightElement={
                            <TouchableOpacity style={styles.thresholdBtn} onPress={() => setActiveModal("ntu")}>
                                <Text style={styles.thresholdValue}>{thresholds.ntu}</Text>
                                <Feather name="edit-2" size={14} color="#0891B2" />
                            </TouchableOpacity>
                        }
                    />
                    <SettingRow
                        iconName="wind"
                        title={t("sensorNames.clo", "Dư lượng Clo")}
                        subtitle={t("settings.thresholdDesc", "Cảnh báo khi vượt ngưỡng")}
                        rightElement={
                            <TouchableOpacity style={styles.thresholdBtn} onPress={() => setActiveModal("clo")}>
                                <Text style={styles.thresholdValue}>{thresholds.clo}</Text>
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
                        iconName="lock"
                        title={t("settings.changePassword", "Đổi mật khẩu")}
                        subtitle={t("settings.changePasswordSubtitle", "Cập nhật mật khẩu bảo vệ tài khoản")}
                        onPress={() => router.push("/change-password")}
                    />
                    <SettingRow
                        iconName="mail"
                        title={t("settings.notifications", "Nhận thông báo qua email")}
                        subtitle={t("settings.notificationsSubtitle", "Cho phép gửi thông báo qua email")}
                        isToggle={true}
                        toggleValue={emailNotification}
                        onToggle={handleToggleEmailNotification}
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
                </Card>

                <ThresholdModal
                    isVisible={activeModal !== null}
                    onClose={() => setActiveModal(null)}
                    title={modalConfig.title}
                    desc={t("settings.thresholdDesc", "Cảnh báo khi giá trị vượt ngoài khoảng an toàn thiết lập.")}
                    unit={modalConfig.unit}
                    min={modalConfig.min}
                    max={modalConfig.max}
                    step={modalConfig.step}
                    currentValue={modalConfig.val}
                    adminDefault={modalConfig.default}
                    onSave={handleSaveThreshold}
                />
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
