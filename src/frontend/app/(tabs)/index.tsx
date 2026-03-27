import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { CardContainer } from "@/components/ui/CardContainer";
import { ToggleRow } from "@/components/ui/ToggleRow";

export default function SettingsTest() {
    // State quản lý bật/tắt cho từng dòng
    const [sysNotification, setSysNotification] = useState(true);
    const [sensorAlert, setSensorAlert] = useState(true);
    const [waterAlert, setWaterAlert] = useState(true);
    const [dailyReport, setDailyReport] = useState(false);

    return (
        <View style={styles.wrapper}>
            <CardContainer>
                {/* Tiêu đề của cả khối */}
                <Text style={styles.cardTitle}>Cài đặt cảnh báo</Text>

                {/* Các dòng cài đặt */}
                <ToggleRow
                    title="Thông báo hệ thống"
                    description="Cho phép ứng dụng gửi thông báo"
                    value={sysNotification}
                    onValueChange={setSysNotification}
                />
                <ToggleRow
                    title="Cảnh báo cảm biến"
                    description="Nhận cảnh báo khi cảm biến gặp sự cố"
                    value={sensorAlert}
                    onValueChange={setSensorAlert}
                />
                <ToggleRow
                    title="Cảnh báo chất lượng nước"
                    description="Nhận thông báo khi có dữ liệu mới từ cảm biến"
                    value={waterAlert}
                    onValueChange={setWaterAlert}
                />
                <ToggleRow
                    title="Báo cáo quan trắc hằng ngày"
                    description="Nhận thông báo thống kê dữ liệu hằng ngày"
                    value={dailyReport}
                    onValueChange={setDailyReport}
                    isLast={true} // Báo cho component biết đây là dòng cuối để bỏ khoảng cách dư thừa
                />
            </CardContainer>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        padding: 16,
        backgroundColor: "#F8F9FA",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1A202C",
        marginBottom: 20, // Khoảng cách từ tiêu đề xuống dòng đầu tiên
    },
});
