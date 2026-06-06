import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Feather } from "@expo/vector-icons";

interface GaugeChartProps {
    value: number;
    min: number;
    max: number;
    unit: string;
    title: string;
    activeColor?: string;
}

export default function GaugeChart({
    value,
    min,
    max,
    unit,
    title,
    activeColor = "#00A89D",
}: GaugeChartProps) {
    const width = 160;
    const height = 100;
    const radius = 65;
    const strokeWidth = 12;

    const cx = width / 2;
    const cy = height - 15;

    const clampedValue = Math.max(min, Math.min(max, value));
    const percentage = (clampedValue - min) / (max - min);

    const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
        const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180.0;
        return {
            x: centerX + r * Math.cos(angleInRadians),
            y: centerY + r * Math.sin(angleInRadians),
        };
    };

    const getArcPath = (startAngle: number, endAngle: number) => {
        const start = polarToCartesian(cx, cy, radius, startAngle);
        const end = polarToCartesian(cx, cy, radius, endAngle);
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;
    };

    const backgroundPath = getArcPath(0, 180);

    const currentAngle = percentage * 180;
    const progressPath = getArcPath(0, currentAngle);

    const getIconName = () => {
        if (!title) return null;
        if (title.includes("Nhiệt độ")) return "thermometer" as const;
        if (title.includes("Độ ẩm")) return "droplet" as const;
        if (title.includes("Ánh sáng")) return "sun" as const;
        return "activity" as const;
    };

    const iconName = getIconName();

    return (
        <View style={styles.container}>
            {title ? (
                <View style={styles.titleContainer}>
                    {iconName && (
                        <Feather 
                            name={iconName} 
                            size={16} 
                            color={activeColor}
                        />
                    )}
                    <Text style={styles.chartTitle}>{title}</Text>
                </View>
            ) : null}
            
            <View style={styles.svgWrapper}>
                <Svg width={width} height={height}>
                    <Path
                        d={backgroundPath}
                        fill="none"
                        stroke="#E2E8F0"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                    />
                    {currentAngle > 0 && (
                        <Path
                            d={progressPath}
                            fill="none"
                            stroke={activeColor}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                        />
                    )}
                </Svg>

                <View style={styles.textOverlay}>
                    <Text style={[styles.valueText, { color: activeColor }]}>
                        {value}
                    </Text>
                    <Text style={styles.unitText}>{unit}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
        gap: 4,
    },
    chartTitle: {
        fontSize: 14,
        color: "#64748B",
        fontFamily: "Inter-Medium",
        textAlign: "center",
    },
    svgWrapper: {
        position: "relative",
        width: 160,
        height: 90,
        alignItems: "center",
    },
    textOverlay: {
        position: "absolute",
        bottom: 10,
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    valueText: {
        fontSize: 22,
        fontFamily: "Inter-Bold",
        lineHeight: 26,
    },
    unitText: {
        fontSize: 14,
        color: "#94A3B8",
        fontFamily: "Inter-Regular",
        marginTop: 2,
    },
});