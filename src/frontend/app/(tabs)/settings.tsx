import ProfileCard from "@/components/settings/ProfileCard";
import StatsCard from "@/components/settings/StatsCard";
import ThresholdModal from "@/components/settings/ThresholdModal";
import AppHeader from "@/components/ui/AppHeader";
import Card from "@/components/ui/Card";
import CustomFilterTab from "@/components/ui/CustomFilterTab";
import SettingRow from "@/components/ui/SettingRow";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
    const tabBarHeight = useTabBarHeight();
    const [emailNotification, setEmailNotification] = useState(true);
    const [language, setLanguage] = useState("vi");
    const [userRole, setUserRole] = useState<"user" | "admin">("admin");
    const [personalThreshold, setPersonalThreshold] = useState(80);
    const [isModalVisible, setModalVisible] = useState(false);
    const adminDefault = 75;

    const languageOptions = [
        { label: "Tiếng Việt", value: "vi" },
        { label: "Tiếng Anh", value: "en" },
    ];

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
                        <Text style={styles.pageTitle}>Cài đặt</Text>
                        <Text style={styles.pageSubtitle}>Điều chỉnh theo sở thích cá nhân của bạn</Text>
                    </View>
                </View>

                <ProfileCard />
                <StatsCard />

                {userRole === "admin" && (
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
                    <Text style={styles.sectionTitle}>Cài đặt cảnh báo</Text>
                    <SettingRow
                        iconName="bell"
                        title="Ngưỡng cảnh báo WQI"
                        subtitle="Mức an toàn cá nhân của bạn"
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
                    <Text style={styles.sectionTitle}>Cài đặt chung</Text>
                    <SettingRow iconName="user" title="Thông tin cá nhân" subtitle="Quản lý thông tin tài khoản" />
                    <SettingRow
                        iconName="mail"
                        title="Nhận thông báo qua email"
                        subtitle="Cho phép gửi thông báo qua email"
                        isToggle={true}
                        toggleValue={emailNotification}
                        onToggle={setEmailNotification}
                        isLast
                    />
                </Card>

                <Card>
                    <Text style={styles.sectionTitle}>Cài đặt hệ thống</Text>
                    <SettingRow
                        iconName="map-pin"
                        title="Danh sách trạm quan trắc"
                        subtitle="Hiển thị vị trí và thông tin các trạm"
                    />
                    <SettingRow
                        iconName="settings"
                        title="Quản lý trạm của bạn"
                        subtitle="Quản lý trạm quan trắc của bạn"
                        isLast
                    />
                </Card>

                <Card>
                    <Text style={styles.sectionTitle}>Hỗ trợ</Text>
                    <SettingRow
                        iconName="help-circle"
                        title="FAQ"
                        subtitle="Nhận trợ giúp về ứng dụng"
                        onPress={openFAQ}
                    />
                    <SettingRow
                        iconName="globe"
                        title="Ngôn ngữ"
                        subtitle="Thay đổi ngôn ngữ"
                        rightElement={
                            <CustomFilterTab
                                options={languageOptions}
                                activeOption={language}
                                onOptionChange={setLanguage}
                            />
                        }
                    />
                    <SettingRow
                        iconName="log-out"
                        title="Đăng xuất"
                        subtitle="Đăng xuất khỏi tài khoản của bạn"
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
