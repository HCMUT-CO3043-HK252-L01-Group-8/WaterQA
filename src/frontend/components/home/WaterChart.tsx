import BaseChart from "@/components/ui/BaseChart";
import CustomFilterTab from "@/components/ui/CustomFilterTab";
import { useRef, useState } from "react";
import { Animated } from "react-native";
import { useTranslation } from "react-i18next";

const MOCK_DATA = {
    day: {
        data: [80, 82, 78, 85, 98, 83, 80],
        labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    },
    month: {
        data: [80, 82, 78, 85, 78, 88, 85, 65, 73, 92, 97, 68],
        labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
    },
};

export default function WaterChart() {
    const { t } = useTranslation();
    const [chartFilter, setChartFilter] = useState<"day" | "month">("day");
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const handleFilterChange = (filter: string) => {
        if (filter === chartFilter) return;
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
            setChartFilter(filter as "day" | "month");
            Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
        });
    };

    return (
        <BaseChart
            title={t("home.waterQualityStats", "Thống kê chất lượng nước")}
            data={MOCK_DATA[chartFilter].data}
            labels={MOCK_DATA[chartFilter].labels}
            smooth={true}
            //highlightMax={true}
            highlightIndex={5}
            lineColor="#00A89D"
            chartHeight={120}
            footerText={t("home.wqiPredictionChart", "Biểu đồ dự đoán WQI")}
            fadeAnim={fadeAnim}
            headerRight={
                <CustomFilterTab
                    options={[
                        { label: t("history.daily", "Ngày"), value: "day" },
                        { label: t("history.monthly", "Tháng"), value: "month" },
                    ]}
                    activeOption={chartFilter}
                    onOptionChange={handleFilterChange}
                />
            }
        />
    );
}
