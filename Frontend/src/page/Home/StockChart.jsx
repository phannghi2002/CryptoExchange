import { fetchMarketChart } from "@/State/Coin/Action";
import { Button } from "@/components/ui/button";
import { data } from "autoprefixer";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";

const timeSeries = [
  {
    keyword: "DIGITAL_CURRENCY_DAILY",
    key: "Time Series (Daily)",
    label: "1 Day",
    value: 1,
  },
  {
    keyword: "DIGITAL_CURRENCY_WEEKLY",
    key: "Time Series (Daily)",
    label: "1 Week",
    value: 7,
  },
  {
    keyword: "DIGITAL_CURRENCY_MONTHLY",
    key: "Time Series (Daily)",
    label: "1 Month",
    value: 30,
  },
  {
    keyword: "DIGITAL_CURRENCY_YEARLY",
    key: "Time Series (Daily)",
    label: "1 Year",
    value: 365,
  },
];

function StockChart({ coinId }) {
  const dispatch = useDispatch();
  const { coin } = useSelector((store) => store);

  console.log("cai nay la nbieu do nay", coin.marketChart);

  const [activeLabel, setActiveLabel] = useState(timeSeries[0]);

  // const series = [
  //   {
  //     data:
  //       activeLabel.value === 1
  //         ? coin.marketChart.data.prices1days
  //         : activeLabel.value === 7
  //         ? coin.marketChart.data.prices7days
  //         : activeLabel.value === 30
  //         ? coin.marketChart.data.prices30days
  //         : activeLabel.value === 365
  //         ? coin.marketChart.data.prices365days
  //         : [], // Fallback in case of unexpected value
  //   },
  // ];

  const series = [
    {
      name: "Price", // Add a name for the series
      data:
        activeLabel.value === 1
          ? coin.marketChart?.data?.prices1days || []
          : activeLabel.value === 7
          ? coin.marketChart?.data?.prices7days || []
          : activeLabel.value === 30
          ? coin.marketChart?.data?.prices30days || []
          : activeLabel.value === 365
          ? coin.marketChart?.data?.prices365days || []
          : [], // Fallback in case of unexpected value
    },
  ];

  const options = {
    chart: {
      id: "area-datetime",
      type: "area",
      height: 450,
      zoom: { autoScaleYaxis: true },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "datetime",
      tickAmount: 6,
    },
    colors: ["#758AA2"],
    markers: {
      colors: ["#fff"],
      strokeColor: "#fff",
      size: 0,
      stokeWidth: 1,
      style: "hollow",
    },
    tooltip: {
      theme: "dark",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100],
      },
      grid: {
        borderColor: "#47535E",
        strokeDashArray: 4,
        show: true,
      },
    },
  };

  const handleActiveLabel = (value) => {
    setActiveLabel(value);
  };

  useEffect(() => {
    dispatch(fetchMarketChart({ coinId, days: activeLabel.value }));
  }, [dispatch, coinId, activeLabel]);
  return (
    <div>
      <div className="space-x-3">
        {timeSeries.map((item) => (
          <Button
            variant={activeLabel.label == item.label ? "" : "outline"}
            key={item.label}
            onClick={() => handleActiveLabel(item)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div id="chart-timelines">
        <ReactApexChart
          options={options}
          series={series}
          height={450}
          type="area"
        />
      </div>
    </div>
  );
}

export default StockChart;
