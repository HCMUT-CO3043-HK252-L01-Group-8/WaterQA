import BaseChart from "@/components/ui/BaseChart";
import { useTranslation } from "react-i18next";

interface DetailedChartProps {
    data: number[];
    labels: string[];
    paramName: string; 
}

export default function DetailedChart({ data, labels, paramName }: DetailedChartProps) {
    const { t } = useTranslation();

    let computedMinY = undefined;
    let computedMaxY = undefined;

    if (data && data.length > 0) {
        const maxVal = Math.max(...data);
        const minVal = Math.min(...data);

        if (maxVal === minVal) {
            computedMinY = minVal - 1;
            computedMaxY = maxVal + 1;
        }
    }

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
            minY={computedMinY}
            maxY={computedMaxY}
        />
    );
}