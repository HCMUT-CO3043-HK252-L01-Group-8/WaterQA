import BaseChart from "@/components/ui/BaseChart";
import { useTranslation } from "react-i18next";

interface DetailedChartProps {
    data: number[];
    labels: string[];
}

export default function DetailedChart({ data, labels }: DetailedChartProps) {
    const { t } = useTranslation();

    return (
        <BaseChart
            title={t("history.wqiFluctuation", "Biến động WQI")}
            data={data}
            labels={labels}
            smooth={false}
            showValues={true}
            highlightMax={false}
            lineColor="#0092B8"
            chartHeight={140}
            minY={70}
            maxY={100}
        />
    );
}
