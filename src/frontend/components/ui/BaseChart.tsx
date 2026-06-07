import { Fragment } from "react";
import { Animated, Dimensions, StyleSheet, Text, View, ScrollView } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

export interface BaseChartProps {
    title: string;
    /** Mảng giá trị – null nghĩa là không có dữ liệu tại nhãn đó */
    data: (number | null)[];
    labels: string[];
    lineColor?: string;
    smooth?: boolean;
    showValues?: boolean;
    highlightMax?: boolean;
    highlightIndex?: number;
    chartHeight?: number;
    chartWidth?: number;
    headerRight?: React.ReactNode;
    footerText?: string;
    minY?: number;
    maxY?: number;
    fadeAnim?: Animated.Value;
    onPointClick?: (index: number) => void;
}

export default function BaseChart({
    title,
    data,
    labels,
    lineColor = "#00A89D",
    smooth = false,
    showValues = false,
    highlightMax = false,
    highlightIndex,
    chartHeight = 140,
    chartWidth,
    headerRight,
    footerText,
    minY,
    maxY,
    fadeAnim,
    onPointClick
}: BaseChartProps) {
    const screenWidth = Dimensions.get("window").width - 64;
    const yAxisWidth = 35;
    const actualChartWidth = chartWidth || screenWidth - yAxisWidth;

    const paddingX = 20;
    const paddingTop = showValues ? 30 : 20;
    const paddingBottom = 20;

    const drawableWidth = actualChartWidth - paddingX * 2;
    const drawableHeight = chartHeight - paddingTop - paddingBottom;

    // Tính Y-axis chỉ từ các giá trị không null
    const validValues = data.filter((v): v is number => v !== null && !isNaN(v));
    const rawMaxVal = validValues.length > 0 ? Math.max(...validValues) : 1;
    const rawMinVal = validValues.length > 0 ? Math.min(...validValues) : 0;
    const maxIndex = data.indexOf(rawMaxVal);

    const padding = rawMaxVal === rawMinVal ? 1 : (rawMaxVal - rawMinVal) * 0.15;
    const minVal = minY !== undefined ? minY : rawMinVal - padding;
    const maxVal = maxY !== undefined ? maxY : rawMaxVal + padding;
    const midVal = (maxVal + minVal) / 2;
    const safeRange = maxVal - minVal === 0 ? 1 : maxVal - minVal;

    // Tổng số slots = labels.length (luôn đủ 24 cho view ngày)
    const totalSlots = labels.length;

    // Tính toạ độ X cho mỗi index (kể cả null)
    const getX = (index: number) =>
        paddingX + (totalSlots <= 1 ? drawableWidth / 2 : (index / (totalSlots - 1)) * drawableWidth);

    // Tính toạ độ Y cho một giá trị
    const getY = (val: number) =>
        paddingTop + drawableHeight - ((val - minVal) / safeRange) * drawableHeight;

    // Tạo các điểm (x, y, val, hasData) cho tất cả slots
    const allPoints = data.map((val, index) => ({
        x: getX(index),
        y: val !== null ? getY(val) : null,
        val,
        hasData: val !== null,
    }));

    // Tạo SVG path: chỉ nối các điểm liền nhau đều có dữ liệu
    // Khi gặp null → nhấc bút (M), khi có dữ liệu liên tiếp → kéo line (L)
    const getPath = () => {
        let path = "";
        let penDown = false;

        for (let i = 0; i < allPoints.length; i++) {
            const pt = allPoints[i];
            if (!pt.hasData || pt.y === null) {
                penDown = false;
                continue;
            }
            if (!penDown) {
                path += `M ${pt.x} ${pt.y} `;
                penDown = true;
            } else {
                path += `L ${pt.x} ${pt.y} `;
            }
        }
        return path.trim();
    };

    const ChartWrapper = fadeAnim ? Animated.View : View;
    const animatedStyle = fadeAnim ? { opacity: fadeAnim } : {};

    const crowded = labels.length > 12;
    const labelWidth = crowded ? 36 : 40;
    const labelFontSize = crowded ? 10 : 11;

    return (
        <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>{title}</Text>
                {headerRight && <View>{headerRight}</View>}
            </View>

            <ChartWrapper style={[styles.chartContainer, animatedStyle]}>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    {/* Fixed Y-Axis */}
                    <View style={{ width: yAxisWidth, height: chartHeight, justifyContent: 'space-between', paddingBottom: paddingBottom + 8, paddingTop: paddingTop - 6, paddingRight: 4 }}>
                        <Text style={styles.yAxisText}>{maxVal.toFixed(1)}</Text>
                        <Text style={styles.yAxisText}>{midVal.toFixed(1)}</Text>
                        <Text style={styles.yAxisText}>{minVal.toFixed(1)}</Text>
                    </View>

                    {/* Scrollable X-Axis and Chart */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
                        <View style={{ width: actualChartWidth, height: chartHeight + 24 }}>
                            <Svg width={actualChartWidth} height={chartHeight}>
                                {/* Horizontal grid lines */}
                                <Path
                                    d={`M 0 ${paddingTop + drawableHeight / 2} L ${actualChartWidth} ${paddingTop + drawableHeight / 2}`}
                                    stroke="#F1F5F9"
                                    strokeWidth="1"
                                    strokeDasharray="4, 4"
                                />
                                <Path
                                    d={`M 0 ${paddingTop + drawableHeight} L ${actualChartWidth} ${paddingTop + drawableHeight}`}
                                    stroke="#F1F5F9"
                                    strokeWidth="1"
                                />

                                {/* Line path – chỉ nối các điểm có dữ liệu */}
                                <Path d={getPath()} fill="none" stroke={lineColor} strokeWidth="2.5" />

                                {/* Dots – chỉ vẽ tại các điểm có dữ liệu */}
                                {allPoints.map((pt, i) => {
                                    if (!pt.hasData || pt.y === null) return null;
                                    const isHighlighted =
                                        (highlightIndex !== undefined && i === highlightIndex) ||
                                        (highlightMax && i === maxIndex);
                                    return (
                                        <Fragment key={`point-${i}`}>
                                            {/* Hit area (transparent, larger) */}
                                            <Circle
                                                cx={pt.x}
                                                cy={pt.y}
                                                r={onPointClick ? 12 : (isHighlighted ? 7 : 4)}
                                                fill="transparent"
                                                stroke="transparent"
                                                onPress={onPointClick ? () => onPointClick(i) : undefined}
                                                style={{ cursor: onPointClick ? 'pointer' : 'default' }}
                                            />
                                            {/* Visible dot */}
                                            <Circle
                                                cx={pt.x}
                                                cy={pt.y}
                                                r={isHighlighted ? 7 : 4}
                                                fill="#FFFFFF"
                                                stroke={isHighlighted ? "#CCEEEB" : lineColor}
                                                strokeWidth={isHighlighted ? 4 : 2}
                                                pointerEvents="none"
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

                            {/* X-axis labels – luôn hiển thị đủ tất cả nhãn */}
                            <View style={styles.xAxisContainer}>
                                {labels.map((label, i) => {
                                    const xPos = getX(i);
                                    const isHighlighted =
                                        (highlightIndex !== undefined && i === highlightIndex) ||
                                        (highlightMax && i === maxIndex);
                                    return (
                                        <Text
                                            key={`label-${i}`}
                                            style={[
                                                styles.axisText,
                                                isHighlighted && { color: lineColor, fontFamily: "Inter-Bold" },
                                                { left: xPos - labelWidth / 2, width: labelWidth, fontSize: labelFontSize },
                                            ]}
                                        >
                                            {label}
                                        </Text>
                                    );
                                })}
                            </View>
                        </View>
                    </ScrollView>
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
    chartContainer: { alignItems: "center", width: '100%' },
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
        position: "absolute",
        bottom: 0,
        borderTopWidth: 1,
        borderTopColor: "#E2E8F0",
        paddingTop: 8,
    },
    axisText: { position: "absolute", textAlign: "center", color: "#64748B", fontFamily: "Inter-Regular" },
    yAxisText: { fontSize: 10, color: "#64748B", fontFamily: "Inter-Medium", textAlign: "right" },
    chartFooter: { fontSize: 10, color: "#64748B", textAlign: "center", marginTop: 16, fontFamily: "Inter-Regular" },
});
