import BaseChart from "@/components/ui/BaseChart";

interface DetailedChartProps {
    data: number[];
    labels: string[];
}

export default function DetailedChart({ data, labels }: DetailedChartProps) {
    return (
        <BaseChart
            title="Biến động WQI"
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
