"use client";
import React, { useEffect, useState } from "react";
import { AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { useGetSalesDataByType } from "@/hooks/useChartsService";

const numFormatter = new Intl.NumberFormat("en-US");

export const PieSalesBySaleType = () => {
  const { data } = useGetSalesDataByType();
  const [options, setOptions] = useState<AgChartOptions>({
    data: [],
    series: [
      {
        type: "donut",
        calloutLabelKey: "saleType",
        angleKey: "percentage",
        sectorLabelKey: "percentage",
        calloutLabel: {
          enabled: false,
        },
        title: {
          text: "Total",
        },
        sectorSpacing: 3,
      },
    ],
    legend: {
      enabled: true,
    },
    formatter: (params) =>
      typeof params.value === "number"
        ? `${numFormatter.format(params.value)} %`
        : String(params.value),
  });
  useEffect(() => {
    if (data) {
      setOptions((prevState) => {
        return { ...prevState, data: data };
      });
    }
  }, [data]);

  return <AgCharts options={options} style={{ height: "400px" }} />;
};
