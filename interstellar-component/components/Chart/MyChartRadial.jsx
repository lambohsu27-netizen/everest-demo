import React, { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
const MyChartRadial = ({
    values = [],
    colors = [],
    labels = [],
    height = 300,
}) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        if (values && values.length) {
            const _values = values.map((e) => parseInt(e) || 0);

            const total = _values.reduce((a, b) => a + b, 0);
            const series = _values.map((e) => {
                if (total !== 0) return (e / total) * 100;
                return 0;
            });

            setChartData({ total: total, values: _values, series: series })
        } else {
            setChartData({ total: 0, values: [], series: [] })
        }
    }, [values])

    const options = useMemo(() => {
        return {
            stroke: { lineCap: 'round' },
            values: chartData?.values ?? [],
            colors: colors,
            labels: labels,
            plotOptions: {
                radialBar: {
                    startAngle: 0,
                    endAngle: 360,
                    track: { background: '#F2F4F7', opacity: 1, margin: 5 },
                    dataLabels: {
                        name: { offsetY: -15 },
                        value: {
                            fontSize: '36px',
                            fontFamily: 'Inter',
                            fontWeight: 600,
                            color: '#101828',
                            offsetY: 5,
                            formatter: function (val, w) {
                                var idx = (w.config.series ?? []).findIndex((e) => e.toString() === val.toString());
                                if (idx !== -1) return w.config.values[idx].toLocaleString();

                                return "-";
                            }
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '14px',
                            fontFamily: 'Inter',
                            fontWeight: 500,
                            color: '#475467',
                            formatter: (w) => {
                                return w.config.values.reduce((a, b) => a + b, 0).toLocaleString()
                            },
                        }
                    }
                }
            }
        };
    }, [chartData?.values, colors, labels])

    return (
        <>
            <ReactApexChart
                type="radialBar"
                height={height}
                options={options}
                series={chartData?.series ?? []}
            />
        </>
    );
};

export default MyChartRadial;
