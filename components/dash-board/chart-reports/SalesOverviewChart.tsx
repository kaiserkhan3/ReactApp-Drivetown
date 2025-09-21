import { useSalesOverviewForGivenYear } from "@/hooks/useChartsService";
import { SalesOverview } from "@/models/inventory/models";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: any;
  payload?: any;
  label?: any;
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          display: "flex",
          flexDirection: "column",

          color: "#fff",
          backgroundColor: "hsl(0, 0%, 0%, 0.6)",
          border: "1px solid #ccc",
          padding: "15px",
        }}
      >
        <p className="label" style={{ marginBottom: "10px" }}>{`${label}`}</p>
        <p className="label" style={{ marginBottom: "5px" }}>
          <i
            className="bi bi-app rounded me-1"
            style={{
              background: "#f5f50a",
              borderColor: "#f5f50a",
              color: "#f5f50a",
            }}
          ></i>
          {`Total Count: ${payload.reduce((acc: number, curValue: { value: number }) => acc + curValue.value, 0)}`}
        </p>
        {payload.map(
          (
            entry: { name: string; value: number; color: string },
            index: number
          ) => {
            return (
              <p key={`item-${index}`} style={{ marginBottom: "2px" }}>
                <i
                  className="bi bi-app rounded me-1"
                  style={{
                    background: `${entry.color}`,
                    borderColor: `${entry.color}`,
                    color: `${entry.color}`,
                  }}
                ></i>
                {`${entry.name}: ${entry.value}`}
              </p>
            );
          }
        )}
      </div>
    );
  }
  return null;
};
type SalesOverviewProps = {
  filter: string;
  year: number;
};
export const SalesOverviewChart = ({
  year,
  filter = "All",
}: SalesOverviewProps) => {
  const [chartData, setChartData] = useState<Partial<SalesOverview>[]>([]);
  const { data } = useSalesOverviewForGivenYear(year);

  useEffect(() => {
    if (data && filter === "All") {
      setChartData(data);
    }
  }, [data]);

  useEffect(() => {
    if (data && filter != "All") {
      setChartData(() => {
        return data.map((i) => {
          return { [filter]: i[filter as keyof SalesOverview], Month: i.Month };
        });
      });
    } else {
      setChartData(data!);
    }
  }, [filter]);

  return (
    <BarChart
      width={900}
      height={400}
      data={chartData}
      margin={{
        top: 20,
        right: 10,
        left: 10,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="Month" />
      <YAxis />

      <Legend align="right" />
      {/* <Bar dataKey="Total Sales" stackId="a" fill="#911e0a" barSize={80} /> */}
      <Bar dataKey="Wholesale" stackId="a" fill="#296352" barSize={80} />
      <Bar dataKey="Cash" stackId="a" fill="#f56c0a" barSize={80} />
      <Bar dataKey="Finance" stackId="a" fill="#0a4591" barSize={80} />
      <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
    </BarChart>
  );
};
