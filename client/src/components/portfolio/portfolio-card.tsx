import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PortfolioCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: React.ReactNode;
  trend?: "up" | "down";
  trendValue?: string;
  className?: string;
}

export function PortfolioCard({
  title,
  value,
  icon,
  description,
  trend,
  trendValue,
  className,
}: PortfolioCardProps) {
  return (
    <Card className={cn("hover:shadow-lg transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm",
                trend === "up" ? "text-green-500" : "text-red-500"
              )}
            >
              {trend === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trendValue && <span>{trendValue}</span>}
            </div>
          )}
        </div>
        {description && <span className="text-xs text-muted-foreground mt-1">{description}</span>}
      </CardContent>
    </Card>
  );
}
