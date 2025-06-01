import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PortfolioData } from "@/lib/api";

interface PortfolioDonutChartProps {
  data?: PortfolioData;
}

const donutColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

export function PortfolioDonutChart({ data }: PortfolioDonutChartProps) {
  // Create distribution data
  const donutData = [];

  if (data?.summary) {
    if (data.summary.numTokens > 0) {
      donutData.push({ name: "Tokens", value: data.summary.numTokens });
    }
    if (data.summary.numNFTs > 0) {
      donutData.push({ name: "NFTs", value: data.summary.numNFTs });
    }
    if (data.summary.numOtherObjects > 0) {
      donutData.push({ name: "Other Objects", value: data.summary.numOtherObjects });
    }
  }

  // If no data, show placeholder
  if (donutData.length === 0) {
    donutData.push({ name: "No Assets", value: 1 });
  }

  return (
    <div className="w-full h-64 bg-card rounded-xl p-4 flex flex-col items-center justify-center">
      <h3 className="text-sm font-medium mb-4">Asset Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={donutData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {donutData.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={donutColors[idx % donutColors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
