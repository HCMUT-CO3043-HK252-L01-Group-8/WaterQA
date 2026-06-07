import React from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { useTranslation } from "react-i18next";

export interface OverviewChartProps {
    data: any[]; // Array of history items
    labels: string[];
}

const COLORS = {
    temperature: "#EF4444",
    humidity: "#3B82F6",
    ph: "#10B981",
    light_intensity: "#F59E0B",
    turbidity: "#8B5CF6",
    water_level: "#06B6D4"
};

const PARAM_KEYS = ["temperature", "humidity", "ph", "light_intensity", "turbidity", "water_level"];
const PARAM_NAMES = ["Nhiệt độ", "Độ ẩm", "pH", "Ánh sáng", "Độ đục", "Mực nước"];

export default function OverviewChart({ data, labels }: OverviewChartProps) {
    const { t } = useTranslation();
    const chartWidth = Dimensions.get("window").width - 64;
    const chartHeight = 180;
    const paddingX = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const drawableWidth = chartWidth - paddingX * 2;
    const drawableHeight = chartHeight - paddingTop - paddingBottom;

    if (!data || data.length === 0) return null;

    // Chuẩn hóa dữ liệu về 0 - 100% để hiển thị chung trên cùng 1 trục
    const datasets = PARAM_KEYS.map(key => {
        const values = data.map(item => Number(item[key]) || 0);
        const maxVal = Math.max(...values, 1);
        const minVal = Math.min(...values);
        
        const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;
        
        return {
            key,
            values,
            points: values.reverse().map((val, index) => {
                const x = paddingX + (index / (values.length - 1 || 1)) * drawableWidth;
                const normalizedVal = (val - minVal) / range;
                const y = paddingTop + drawableHeight - (normalizedVal * drawableHeight);
                return { x, y, val };
            }),
            color: COLORS[key as keyof typeof COLORS] || "#000"
        };
    });

    return (
        <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>{t("Tổng quan biến động")}</Text>
            </View>

            <View style={styles.chartContainer}>
                <Svg width={chartWidth} height={chartHeight}>
                    {datasets.map(dataset => {
                        const { points, color } = dataset;
                        if (points.length === 0) return null;
                        
                        let path = `M ${points[0].x} ${points[0].y}`;
                        const smoothing = 0.15;
                        for (let i = 0; i < points.length - 1; i++) {
                            const p0 = points[i === 0 ? 0 : i - 1];
                            const p1 = points[i];
                            const p2 = points[i + 1];
                            const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

                            const cp1X = p1.x + (p2.x - p0.x) * smoothing;
                            const cp1Y = p1.y + (p2.y - p0.y) * smoothing;
                            const cp2X = p2.x - (p3.x - p1.x) * smoothing;
                            const cp2Y = p2.y - (p3.y - p1.y) * smoothing;

                            path += ` C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${p2.x} ${p2.y}`;
                        }

                        return <Path key={dataset.key} d={path} fill="none" stroke={color} strokeWidth="2" />;
                    })}
                </Svg>

                <View style={styles.xAxisContainer}>
                    {labels.map((label, i) => {
                        if (!label) return null;
                        const isCrowded = labels.length > 7;
                        const labelWidth = isCrowded ? 30 : 35;
                        const labelFontSize = isCrowded ? 10 : 11;
                        // Map the label X based on index. Note: labels are passed from reversed list
                        const pointIndex = i; 
                        const x = paddingX + (pointIndex / (labels.length - 1 || 1)) * drawableWidth;

                        return (
                            <Text
                                key={`label-${i}`}
                                style={[
                                    styles.axisText,
                                    { left: x - labelWidth / 2, width: labelWidth, fontSize: labelFontSize },
                                ]}
                            >
                                {label}
                            </Text>
                        );
                    })}
                </View>
            </View>
            
            <View style={styles.legendContainer}>
                {PARAM_KEYS.map((key, index) => (
                    <View key={key} style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: COLORS[key as keyof typeof COLORS] }]} />
                        <Text style={styles.legendText}>{PARAM_NAMES[index]}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    chartCard: {
        marginHorizontal: 16,
        marginBottom: 24,
        padding: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    chartHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
    chartTitle: { fontSize: 13, color: "#1E293B", fontFamily: "Inter-SemiBold" },
    chartContainer: { alignItems: "center" },
    xAxisContainer: {
        height: 24,
        width: "100%",
        position: "absolute",
        bottom: 0,
        borderTopWidth: 1,
        borderTopColor: "#E2E8F0",
        paddingTop: 8,
    },
    axisText: { position: "absolute", textAlign: "center", color: "#64748B", fontFamily: "Inter-Regular" },
    legendContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: 10,
        gap: 10,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    legendColor: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 4,
    },
    legendText: {
        fontSize: 10,
        color: "#64748B",
        fontFamily: "Inter-Regular",
    }
});
