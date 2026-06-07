import BaseChart from "@/components/ui/BaseChart";
import { useTranslation } from "react-i18next";

interface DetailedChartProps {
    data: (number | null)[];
    labels: string[];
    paramName: string;
    onPointClick?: (index: number) => void;
}

export default function DetailedChart({ data, labels, paramName, onPointClick }: DetailedChartProps) {
    const { t } = useTranslation();

    // Tính min/max chỉ từ các giá trị thực (bỏ null)
    const validValues = data.filter((v): v is number => v !== null);

    let computedMinY = undefined;
    let computedMaxY = undefined;

    if (validValues.length > 0) {
        const maxVal = Math.max(...validValues);
        const minVal = Math.min(...validValues);

        if (maxVal === minVal) {
            computedMinY = minVal - 1;
            computedMaxY = maxVal + 1;
        }
    }

    // Nếu nhiều hơn 7 cột, tăng width để bật cuộn ngang
    const scrollableWidth = labels.length > 7 ? labels.length * 45 : undefined;

    return (
        <BaseChart
            title={`${t("Biến động")} ${paramName.toLowerCase()}`}
            data={data}
            labels={labels}
            smooth={false}
            showValues={false}
            highlightMax={false}
            lineColor="#0092B8"
            chartHeight={140}
            chartWidth={scrollableWidth}
            minY={computedMinY}
            maxY={computedMaxY}
            onPointClick={onPointClick}
        />
    );
}