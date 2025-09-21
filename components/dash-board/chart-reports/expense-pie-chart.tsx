"use client";
import React, { useEffect, useState } from "react";
import { AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { useGetExpenseData } from "@/hooks/useChartsService";

const numFormatter = new Intl.NumberFormat("en-US");

export const ExpensePieChart = () => {
  const { data } = useGetExpenseData();
  const [options, setOptions] = useState<AgChartOptions>({
    // title: {
    //   text: "Expenses",
    // },
    // subtitle: {
    //   text: "Easy Apple Pie (Serves 4)",
    // },
    // footnote: {
    //   text: "Bake the pie in the oven for 25 minutes at 180℃",
    // },
    data: [],
    series: [
      {
        type: "pie",
        calloutLabelKey: "expenseType",
        sectorLabelKey: "totalAmount",
        angleKey: "totalAmount",
        calloutLabel: {
          offset: 1,
        },
      },
    ],
    legend: {
      enabled: true,
    },
    formatter: (params) =>
      typeof params.value === "number"
        ? `${"$ " + numFormatter.format(params.value)}`
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
