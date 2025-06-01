import React from "react";
import Link from "next/link";
import { PortfolioData } from "@/lib/api";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Repeat,
  Activity,
  Hash,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Transaction {
  digest: string;
  timestamp: string;
  kind: string;
  events: unknown[];
  balanceChanges: unknown[];
}

interface PortfolioTransactionTableProps {
  transactions: Transaction[];
  portfolioData?: PortfolioData;
}

export function PortfolioTransactionTable({
  transactions,
  portfolioData,
}: PortfolioTransactionTableProps) {
  // Format timestamp to readable date and time
  const formatDateTime = (timestamp: string) => {
    const date = new Date(parseInt(timestamp));
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      relative: getRelativeTime(date),
    };
  };

  // Get relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Truncate transaction hash for display
  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  // Determine transaction type icon and color
  const getTransactionStyle = (kind: string) => {
    const kindLower = kind?.toLowerCase() || "";
    if (kindLower.includes("transfer") || kindLower.includes("send")) {
      return {
        icon: <ArrowUpRight className="h-4 w-4" />,
        color: "text-red-500",
        bgColor: "bg-red-500/10 border-red-500/20",
      };
    } else if (kindLower.includes("receive")) {
      return {
        icon: <ArrowDownLeft className="h-4 w-4" />,
        color: "text-green-500",
        bgColor: "bg-green-500/10 border-green-500/20",
      };
    } else if (kindLower.includes("swap")) {
      return {
        icon: <Repeat className="h-4 w-4" />,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10 border-blue-500/20",
      };
    }
    return {
      icon: <Activity className="h-4 w-4" />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10 border-purple-500/20",
    };
  };

  // Get transaction type label
  const getTransactionType = (kind: string, events: unknown[]) => {
    if (!kind) return "Transaction";

    // Try to determine from kind
    const kindLower = kind.toLowerCase();
    if (kindLower.includes("transfer")) return "Transfer";
    if (kindLower.includes("swap")) return "Swap";
    if (kindLower.includes("stake")) return "Stake";
    if (kindLower.includes("unstake")) return "Unstake";
    if (kindLower.includes("mint")) return "Mint";
    if (kindLower.includes("burn")) return "Burn";

    // Check events count as additional info
    if (events && events.length > 0) return `${kind}`;

    return kind;
  };

  // Calculate net amount from balance changes
  const getNetAmount = (balanceChanges: unknown[]) => {
    if (!balanceChanges || balanceChanges.length === 0)
      return { amount: "0", formatted: "0 SUI", isPositive: false };

    let netAmount = 0;
    balanceChanges.forEach((change) => {
      const changeObj = change as { amount?: string; owner?: { AddressOwner?: string } };
      const amount = parseInt(changeObj.amount || "0");
      if (changeObj.owner?.AddressOwner === portfolioData?.address) {
        netAmount += amount;
      }
    });

    const amountInSUI = netAmount / 1e9;
    const isPositive = amountInSUI > 0;
    const formatted =
      amountInSUI !== 0 ? `${isPositive ? "+" : ""}${amountInSUI.toFixed(9)} SUI` : "0 SUI";

    return { amount: amountInSUI.toString(), formatted, isPositive };
  };

  return (
    <Card className="border-primary/10 bg-gradient-to-br from-card to-card/50 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base font-mono">
          <Hash className="h-4 w-4 text-primary" />
          Transaction History
        </CardTitle>
        <Badge variant="outline" className="font-mono text-xs">
          {transactions.length} TXs
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Activity className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm font-mono">No transactions found</p>
          </div>
        ) : (
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase bg-muted/50 font-mono">
                <tr>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Time</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Events</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">TX Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {transactions.slice(0, 10).map((tx) => {
                  const { relative } = formatDateTime(tx.timestamp);
                  const { formatted, isPositive } = getNetAmount(tx.balanceChanges);
                  const { icon, color, bgColor } = getTransactionStyle(tx.kind);

                  return (
                    <tr key={tx.digest} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg border ${bgColor}`}>
                            <span className={color}>{icon}</span>
                          </div>
                          <span className="font-mono text-xs">
                            {getTransactionType(tx.kind, tx.events)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span className="font-mono text-xs">{relative}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-mono text-xs font-medium ${
                            isPositive
                              ? "text-green-500"
                              : formatted === "0 SUI"
                              ? "text-muted-foreground"
                              : "text-red-500"
                          }`}
                        >
                          {formatted}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="font-mono text-xs">
                          {tx.events?.length || 0}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 font-mono text-xs">
                          <div className="h-1.5 w-1.5 bg-green-500 rounded-full mr-1" />
                          Success
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`https://suiscan.xyz/mainnet/tx/${tx.digest}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary/70 hover:text-primary transition-colors font-mono text-xs"
                        >
                          {truncateHash(tx.digest)}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
