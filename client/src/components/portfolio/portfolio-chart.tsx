import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { PortfolioData } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

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

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-lg p-3 shadow-xl">
          <p className="text-sm font-mono text-primary">{label}</p>
          <p className="text-sm font-bold">{payload[0].value.toFixed(6)} SUI</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-primary/10 bg-gradient-to-br from-card to-card/50 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-mono">
          <Activity className="h-4 w-4 text-primary" />
          Token Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                fontFamily="monospace"
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} fontFamily="monospace" />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                fill="url(#barGradient)"
                radius={[8, 8, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
