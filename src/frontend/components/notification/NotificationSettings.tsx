import Card from "@/components/ui/Card";
import SettingRow from "@/components/ui/SettingRow";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authServices } from "@/services/authServices";

const SETTINGS_KEY = "notification_preferences";

export default function NotificationSettings() {
    const { t } = useTranslation();
    const [systemNotification, setSystemNotification] = useState(true);
    const [sensorAlert, setSensorAlert] = useState(true);
    const [qualityAlert, setQualityAlert] = useState(true);
    const [dailyReport, setDailyReport] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const meRes = await authServices.getMe();
                if (meRes.success && meRes.payload) {
                    setSystemNotification(meRes.payload.email_notifications);
                }

                const saved = await AsyncStorage.getItem(SETTINGS_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    setSensorAlert(parsed.sensorAlert ?? true);
                    setQualityAlert(parsed.qualityAlert ?? true);
                    setDailyReport(parsed.dailyReport ?? false);
                }
            } catch (error) {
                console.error("Lỗi load cài đặt:", error);
            }
        };
        loadSettings();
    }, []);

    const toggleSystemNotification = async (value: boolean) => {
        setSystemNotification(value);
        try {
            const res = await authServices.updateEmailNotifications(value);
            if (!res.success) {
                setSystemNotification(!value);
                Alert.alert(t("common.error", "Lỗi"), "Không thể đồng bộ cài đặt lên máy chủ.");
            }
        } catch (error) {
            console.error("Error in NOTIFICATION SETTINGS:", error)
            setSystemNotification(!value);
            Alert.alert(t("common.error", "Lỗi"), "Lỗi kết nối khi lưu cài đặt.");
        }
    };

    const toggleLocalSetting = async (key: string, value: boolean, setter: (val: boolean) => void) => {
        setter(value);
        try {
            const saved = await AsyncStorage.getItem(SETTINGS_KEY);
            const parsed = saved ? JSON.parse(saved) : {};
            parsed[key] = value;
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
        } catch (error) {
            console.error("Lỗi lưu local setting:", error);
        }
    };

    return (
        <Card>
            <Text style={styles.settingsTitle}>{t("settings.alerts", "Cài đặt cảnh báo")}</Text>

            <SettingRow
                title={t("notifications.systemNotification", "Thông báo hệ thống")}
                subtitle={t("notifications.systemNotificationDesc", "Cho phép ứng dụng gửi thông báo")}
                isToggle={true}
                toggleValue={systemNotification}
                onToggle={toggleSystemNotification}
            />

            <View pointerEvents={systemNotification ? "auto" : "none"} style={!systemNotification && styles.disabled}>
                <SettingRow
                    title={t("notifications.sensorAlert", "Cảnh báo cảm biến")}
                    subtitle={t("notifications.sensorAlertDesc", "Nhận cảnh báo khi cảm biến gặp sự cố")}
                    isToggle={true}
                    toggleValue={sensorAlert}
                    onToggle={(val) => toggleLocalSetting("sensorAlert", val, setSensorAlert)}
                />
                <SettingRow
                    title={t("notifications.waterAlert", "Cảnh báo chất lượng nước")}
                    subtitle={t("notifications.waterAlertDesc", "Nhận thông báo khi có dữ liệu mới từ cảm biến")}
                    isToggle={true}
                    toggleValue={qualityAlert}
                    onToggle={(val) => toggleLocalSetting("qualityAlert", val, setQualityAlert)}
                />
                <SettingRow
                    title={t("notifications.dailyReport", "Báo cáo quan trắc hằng ngày")}
                    subtitle={t("notifications.dailyReportDesc", "Nhận thông báo thống kê dữ liệu hằng ngày")}
                    isToggle={true}
                    toggleValue={dailyReport}
                    onToggle={(val) => toggleLocalSetting("dailyReport", val, setDailyReport)}
                    isLast={true}
                />
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    settingsTitle: { fontSize: 14, color: "#0F172B", marginBottom: 16, fontFamily: "Inter-SemiBold" },
    disabled: { opacity: 0.4 },
});
