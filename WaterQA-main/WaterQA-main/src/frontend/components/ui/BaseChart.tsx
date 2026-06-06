import { Fragment } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

export interface BaseChartProps {
    title: string;
    data: number[];
    labels: string[];
    lineColor?: string;
    smooth?: boolean;
    showValues?: boolean;
    highlightMax?: boolean;
    chartHeight?: number;
    headerRight?: React.ReactNode;
    footerText?: string;
    minY?: number;
    maxY?: number;
    fadeAnim?: Animated.Value;
}

export default function BaseChart({
    title,
    data,
    labels,
    lineColor = "#00A89D",
    smooth = false,
    showValues = false,
    highlightMax = false,
    chartHeight = 140,
    headerRight,
    footerText,
    minY,
    maxY,
    fadeAnim,
}: BaseChartProps) {
    const chartWidth = Dimensions.get("window").width - 64;
    const paddingX = 20;
    const paddingTop = showValues ? 30 : 20;
    const paddingBottom = 20;

    const drawableWidth = chartWidth - paddingX * 2;
    const drawableHeight = chartHeight - paddingTop - paddingBottom;

    const rawMaxVal = Math.max(...data);
    const rawMinVal = Math.min(...data);
    const maxIndex = data.indexOf(rawMaxVal);

    const minVal = minY !== undefined ? minY : rawMinVal - (rawMaxVal - rawMinVal) * 0.1;
    const maxVal = maxY !== undefined ? maxY : rawMaxVal + (rawMaxVal - rawMinVal) * 0.1;

    const points = data.map((val, index) => {
        const x = paddingX + (index / (data.length - 1)) * drawableWidth;
        const y = paddingTop + drawableHeight - ((val - minVal) / (maxVal - minVal)) * drawableHeight;
        return { x, y, val };
    });

    const getPath = () => {
        if (points.length === 0) return "";
        let path = `M ${points[0].x} ${points[0].y}`;

        if (!smooth) {
            for (let i = 1; i < points.length; i++) {
                path += ` L ${points[i].x} ${points[i].y}`;
            }
            return path;
        }

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
        return path;
    };

    const ChartWrapper = fadeAnim ? Animated.View : View;
    const animatedStyle = fadeAnim ? { opacity: fadeAnim } : {};

    return (
        <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>{title}</Text>
                {headerRight && <View>{headerRight}</View>}
            </View>

            <ChartWrapper style={[styles.chartContainer, animatedStyle]}>
                <Svg width={chartWidth} height={chartHeight}>
                    <Path
                        d={`M 0 ${paddingTop + drawableHeight / 2} L ${chartWidth} ${paddingTop + drawableHeight / 2}`}
                        stroke="#F1F5F9"
                        strokeWidth="1"
                        strokeDasharray={smooth ? "4, 4" : "0"}
                    />
                    <Path
                        d={`M 0 ${paddingTop + drawableHeight} L ${chartWidth} ${paddingTop + drawableHeight}`}
                        stroke="#F1F5F9"
                        strokeWidth="1"
                    />

                    <Path d={getPath()} fill="none" stroke={lineColor} strokeWidth={smooth ? "3" : "2.5"} />

                    {points.map((pt, i) => {
                        const isMax = highlightMax && i === maxIndex;
                        return (
                            <Fragment key={`point-${i}`}>
                                <Circle
                                    cx={pt.x}
                                    cy={pt.y}
                                    r={isMax ? 7 : 4}
                                    fill={smooth ? lineColor : "#FFFFFF"}
                                    stroke={isMax ? "#CCEEEB" : smooth ? "none" : lineColor}
                                    strokeWidth={isMax ? 4 : smooth ? 0 : 2}
                                />
                                {showValues && (
                                    <Text style={[styles.dataValueText, { left: pt.x - 10, top: pt.y - 20 }]}>
                                        {pt.val}
                                    </Text>
                                )}
                            </Fragment>
                        );
                    })}
                </Svg>

                <View style={styles.xAxisContainer}>
                    {labels.map((label, i) => {
                        const isCrowded = labels.length > 7;
                        const labelWidth = isCrowded ? 24 : 35;
                        const labelFontSize = isCrowded ? 10 : 11;
                        const isMaxHighlight = highlightMax && i === maxIndex;

                        return (
                            <Text
                                key={`label-${i}`}
                                style={[
                                    styles.axisText,
                                    isMaxHighlight && { color: lineColor, fontFamily: "Inter-Bold" },
                                    { left: points[i].x - labelWidth / 2, width: labelWidth, fontSize: labelFontSize },
                                ]}
                            >
                                {label}
                            </Text>
                        );
                    })}
                </View>
            </ChartWrapper>

            {footerText && <Text style={styles.chartFooter}>{footerText}</Text>}
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
    dataValueText: {
        position: "absolute",
        fontSize: 10,
        color: "#0F172B",
        fontFamily: "Inter-Bold",
        textAlign: "center",
        width: 20,
    },
    xAxisContainer: {
        height: 24,
        width: "100%",
        position: "relative",
        borderTopWidth: 1,
        borderTopColor: "#E2E8F0",
        paddingTop: 8,
    },
    axisText: { position: "absolute", textAlign: "center", color: "#64748B", fontFamily: "Inter-Regular" },
    chartFooter: { fontSize: 10, color: "#64748B", textAlign: "center", marginTop: 16, fontFamily: "Inter-Regular" },
});
