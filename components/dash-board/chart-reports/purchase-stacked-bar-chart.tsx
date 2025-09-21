"use client";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-community";
import { Suspense, useEffect, useState } from "react";
import {
  usePurchaseDataForGivenYearPurchase,
  useStackedBarChartSeries,
} from "@/hooks/useChartsService";
import ThreeDotLoader from "@/components/loading-control/Three-dots-loader/ThreeDotsLoader";

export const StackedBarChartForPurchanse = () => {
  const { stackedChartSeries } = useStackedBarChartSeries();
  const year = 2024;
  const { purchseDataForGivenYear } = usePurchaseDataForGivenYearPurchase(year);

  const [options, setOptions] = useState<AgChartOptions>({
    title: {
      text: `Vehicle Purchase by Month for selected year ${year}`,
    },
    // Data: Data to be displayed in the chart
    data: [],
    theme: {
      overrides: {
        bar: {
          series: {
            stroke: "transparent",
            strokeWidth: 2,
            cornerRadius: 6,
            fillOpacity: 0.8,
            label: {
              enabled: true,
            },
          },
        },
      },
    },
    footnote: {
      text: ` Source: Purchases during the selected year ${year}`,
    },
    // Series: Defines which chart type and data to use
    series: [],
    axes: [
      {
        type: "category",
        position: "bottom",
        paddingInner: 0,
        paddingOuter: 0,
      },
      {
        type: "number",
        position: "left",
        gridLine: {
          enabled: false,
        },
        label: {
          enabled: false,
        },
        crosshair: {
          enabled: false,
        },
      },
    ],
  });

  useEffect(() => {
    if (purchseDataForGivenYear) {
      setOptions((prevState) => ({
        ...prevState,
        data: purchseDataForGivenYear,
        series: stackedChartSeries,
      }));
    }
  }, [purchseDataForGivenYear]);
  return (
    <Suspense fallback={<ThreeDotLoader />}>
      <AgCharts options={options} style={{ height: "700px" }} />
    </Suspense>
  );
};
