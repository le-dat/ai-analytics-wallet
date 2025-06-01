import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { PortfolioData } from "@/lib/api";

interface PortfolioChartProps {
  data?: PortfolioData;
}

export function PortfolioChart({ data }: PortfolioChartProps) {
  // Transform token data for the chart
  const chartData =
    data?.tokens?.slice(0, 5).map((token) => {
      const coinName = token.coinType.split("::").pop() || "Unknown";
      return {
        name: coinName,
        value: token.balance ? parseInt(token.balance) / 1e9 : 0, // Convert from nano to SUI
      };
    }) || [];

  // Add a summary bar if we have data
  if (data?.summary) {
    chartData.unshift({
      name: "Total In",
      value: data.summary.totalInSUI,
    });
  }

  return (
    <div className="w-full h-64 bg-card rounded-xl p-4">
      <h3 className="text-sm font-medium mb-4">Token Holdings</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value: number) => `${value.toFixed(4)} SUI`} />
          <Bar dataKey="value" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
