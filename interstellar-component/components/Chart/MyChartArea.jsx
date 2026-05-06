import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
const MyChartArea = ({
  series = [],
  colors = [],
  labels = [],
  height = 300,
}) => {

  const optionsBar = {
    chart: {
      height: 252,
      toolbar: { show: false },
    },
    grid: { borderColor: "#F2F4F7" },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    xaxis: {
      categories: labels,
      labels: {
        show: true,
        style: {
          colors: ["#475467"],
          fontSize: "12px",
          fontFamily: "Inter",
          fontWeight: 400,
        },
      },
    },
    yaxis: {

      labels: {
        show: true,
        formatter: (w) => {
          return `${w}%`
        },
        style: {
          colors: ["#475467"],
          fontSize: "12px",
          fontFamily: "Inter",
          fontWeight: 400,
        },
      },
    },
    legend: { show: false },
    tooltip: { enabled: true },
  };

  const seriesData = useMemo(() => {
    return series.map((e, i) => {
      e.color = (colors ?? []).length > i ? colors[i] : null;

      return e;
    });
  }, [series, colors]);

  return (
    <>
      <ReactApexChart
        type="area"
        options={optionsBar}
        series={seriesData}
        height={height}
      />
    </>
  );
};

export default MyChartArea;
