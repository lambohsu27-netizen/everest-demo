import React, { useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

const MyChartLine = () => {

    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Dataset 1',
                data: [1,32,33,32,31,32,31,33,32,33,31,32],
                borderColor: '#55B3D9',
                backgroundColor: (context) => {
                    if (!context.chart.chartArea) return;
                    const { ctx, data, chartArea: { top, bottom } } = context.chart;
                    const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
                    gradientBg.addColorStop(0, 'rgba(127, 86, 217, 0.1)');
                    gradientBg.addColorStop(1, 'rgba(0, 0, 0, 0)');

                    return gradientBg;
                },
                // backgroundColor: 'rgba(127, 86, 217, 0.1)',
                fill: true,
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
        },
    };
    return (
        <>
            <Line options={options} data={data} />
        </>
    );
};

export default MyChartLine;