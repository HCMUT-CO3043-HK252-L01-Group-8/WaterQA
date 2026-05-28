import BaseChart from "@/components/ui/BaseChart";
import CustomFilterTab from "@/components/ui/CustomFilterTab";
import { useRef, useState } from "react";
import { Animated } from "react-native";

const MOCK_DATA = {
    day: {
        data: [80, 82, 78, 85, 78, 88, 85],
        labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    },
    month: {
        data: [80, 82, 78, 85, 78, 88, 85, 65, 73, 92, 97, 68],
        labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
    },
};

export default function WaterChart() {
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
            title="Thống kê chất lượng nước"
            data={MOCK_DATA[chartFilter].data}
            labels={MOCK_DATA[chartFilter].labels}
            smooth={true}
            highlightMax={true}
            lineColor="#00A89D"
            chartHeight={120}
            footerText="Biểu đồ dự đoán WQI"
            fadeAnim={fadeAnim}
            headerRight={
                <CustomFilterTab
                    options={[
                        { label: "Theo ngày", value: "day" },
                        { label: "Theo tháng", value: "month" },
                    ]}
                    activeOption={chartFilter}
                    onOptionChange={handleFilterChange}
                />
            }
        />
    );
}
