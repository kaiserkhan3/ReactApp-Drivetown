"use client";
import React, { useEffect, useState } from "react";
import { AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { useProfitWithMarginForGivenYear } from "@/hooks/useChartsService";

export const ProfitWithMargin = ({ year }: { year: number }) => {
  const { data } = useProfitWithMarginForGivenYear();
  const [options, setOptions] = useState<AgChartOptions>({
    // title: {
    //   text: "Annual Fuel Expenditure",
    // },
    data: [],
    series: [
      {
        type: "line",
        xKey: "month",
        yKey: "profit",
        yName: "Profit",
      },
      {
        type: "line",
        xKey: "month",
        yKey: "profitMargin",
        yName: "Margin",
      },
    ],
  });

  useEffect(() => {
    if (data) {
      setOptions((prevState) => {
        return { ...prevState, data };
      });
    }
  }, [data]);

  return <AgCharts options={options} style={{ height: "400px" }} />;
};

function getData() {
  return [
    {
      quarter: "Q1",
      petrol: 200,
      diesel: 100,
    },
    {
      quarter: "Q2",
      petrol: 300,
      diesel: 130,
    },
    {
      quarter: "Q3",
      petrol: 350,
      diesel: 160,
    },
    {
      quarter: "Q4",
      petrol: 400,
      diesel: 200,
    },
  ];
}
