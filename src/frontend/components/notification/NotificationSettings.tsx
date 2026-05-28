import Card from "@/components/ui/Card";
import SettingRow from "@/components/ui/SettingRow";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function NotificationSettings() {
    const [systemNotification, setSystemNotification] = useState(true);
    const [sensorAlert, setSensorAlert] = useState(true);
    const [qualityAlert, setQualityAlert] = useState(true);
    const [dailyReport, setDailyReport] = useState(false);

    return (
        <Card>
            <Text style={styles.settingsTitle}>Cài đặt cảnh báo</Text>

            <SettingRow
                title="Thông báo hệ thống"
                subtitle="Cho phép ứng dụng gửi thông báo"
                isToggle={true}
                toggleValue={systemNotification}
                onToggle={setSystemNotification}
            />

            <View pointerEvents={systemNotification ? "auto" : "none"} style={!systemNotification && styles.disabled}>
                <SettingRow
                    title="Cảnh báo cảm biến"
                    subtitle="Nhận cảnh báo khi cảm biến gặp sự cố"
                    isToggle={true}
                    toggleValue={sensorAlert}
                    onToggle={setSensorAlert}
                />
                <SettingRow
                    title="Cảnh báo chất lượng nước"
                    subtitle="Nhận thông báo khi có dữ liệu mới từ cảm biến"
                    isToggle={true}
                    toggleValue={qualityAlert}
                    onToggle={setQualityAlert}
                />
                <SettingRow
                    title="Báo cáo quan trắc hằng ngày"
                    subtitle="Nhận thông báo thống kê dữ liệu hằng ngày"
                    isToggle={true}
                    toggleValue={dailyReport}
                    onToggle={setDailyReport}
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
