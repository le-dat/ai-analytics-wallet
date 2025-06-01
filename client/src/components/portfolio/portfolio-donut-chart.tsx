import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PortfolioData } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChartIcon } from "lucide-react";

interface PortfolioDonutChartProps {
  data?: PortfolioData;
}

const donutColors = [
  "#a855f7", // Purple (more vibrant)
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Yellow
  "#ef4444", // Red
];

export function PortfolioDonutChart({ data }: PortfolioDonutChartProps) {
  // Create distribution data
  const donutData = [];

  if (data?.summary) {
    if (data.summary.numTokens > 0) {
      donutData.push({ name: "Tokens", value: data.summary.numTokens, percentage: 0 });
    }
    if (data.summary.numNFTs > 0) {
      donutData.push({ name: "NFTs", value: data.summary.numNFTs, percentage: 0 });
    }
    if (data.summary.numOtherObjects > 0) {
      donutData.push({ name: "Other", value: data.summary.numOtherObjects, percentage: 0 });
    }
  }

  // Calculate percentages
  const total = donutData.reduce((sum, item) => sum + item.value, 0);
  donutData.forEach((item) => {
    item.percentage = total > 0 ? (item.value / total) * 100 : 0;
  });

  // If no data, show placeholder
  if (donutData.length === 0) {
    donutData.push({ name: "No Assets", value: 1, percentage: 100 });
  }

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: { percentage: number } }>;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-lg p-3 shadow-xl">
          <p className="text-sm font-mono text-primary">{payload[0].name}</p>
          <p className="text-sm font-bold">{payload[0].value} assets</p>
          <p className="text-xs text-muted-foreground">
            {payload[0].payload.percentage.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percentage,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percentage: number;
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-mono font-semibold"
      >
        {percentage > 5 ? `${percentage.toFixed(0)}%` : ""}
      </text>
    );
  };

  // Generate unique ID for this chart instance
  const chartId = React.useId();

  return (
    <Card className="border-primary/10 bg-gradient-to-br from-card to-card/50 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-mono">
          <PieChartIcon className="h-4 w-4 text-primary" />
          Asset Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-64 flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {donutColors.map((color, index) => (
                  <linearGradient
                    key={`${chartId}-gradient-${index}`}
                    id={`${chartId}-gradient-${index}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                labelLine={false}
                label={renderLabel}
                animationBegin={0}
                animationDuration={800}
              >
                {donutData.map((entry, idx) => {
                  const colorIndex = idx % donutColors.length;
                  const hasGradientSupport =
                    typeof window !== "undefined" && CSS.supports("fill", "url(#test)");

                  return (
                    <Cell
                      key={`cell-${idx}`}
                      fill={
                        hasGradientSupport
                          ? `url(#${chartId}-gradient-${colorIndex})`
                          : donutColors[colorIndex]
                      }
                      stroke={donutColors[colorIndex]}
                      strokeWidth={0.5}
                      strokeOpacity={0.3}
                    />
                  );
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {donutData.map((entry, idx) => (
              <div key={`legend-${idx}`} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{
                    backgroundColor: donutColors[idx % donutColors.length],
                    boxShadow: `0 0 8px ${donutColors[idx % donutColors.length]}40`,
                  }}
                />
                <span className="text-xs font-mono text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
