import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
const MyChartBar = ({
  series = [],
  colors = [],
  labels = [],
  height = 300,
}) => {
    
  const optionsBar = {
    grid: { borderColor: "#F2F4F7" },
    chart: {
      type: "bar",
      height: "100%",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
        columnWidth: "16px",
      },
    },
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
        style: {
          colors: ["#475467"],
          fontSize: "12px",
          fontFamily: "Inter",
          fontWeight: 400,
        },
      },
    },
    legend: { show: false },
    dataLabels: { enabled: false },
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
        type="bar"
        options={optionsBar}
        series={seriesData}
        height={height}
      />
    </>
  );
};

export default MyChartBar;
