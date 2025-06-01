import React from "react";
import Link from "next/link";
import { PortfolioData } from "@/lib/api";
import { ArrowUpRight, ArrowDownLeft, Repeat, Activity } from "lucide-react";

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
    };
  };

  // Truncate transaction hash for display
  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  // Determine transaction type icon
  const getTransactionIcon = (kind: string) => {
    const kindLower = kind?.toLowerCase() || "";
    if (kindLower.includes("transfer") || kindLower.includes("send")) {
      return <ArrowUpRight className="h-4 w-4 text-red-500" />;
    } else if (kindLower.includes("receive")) {
      return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
    } else if (kindLower.includes("swap")) {
      return <Repeat className="h-4 w-4 text-blue-500" />;
    }
    return <Activity className="h-4 w-4 text-muted-foreground" />;
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

    // Check events count as additional info
    if (events && events.length > 0) return `${kind} (${events.length} events)`;

    return kind;
  };

  // Calculate net amount from balance changes
  const getNetAmount = (balanceChanges: unknown[]) => {
    if (!balanceChanges || balanceChanges.length === 0) return "0";

    let netAmount = 0;
    balanceChanges.forEach((change) => {
      const changeObj = change as { amount?: string; owner?: { AddressOwner?: string } };
      const amount = parseInt(changeObj.amount || "0");
      if (changeObj.owner?.AddressOwner === portfolioData?.address) {
        netAmount += amount;
      }
    });

    const amountInSUI = netAmount / 1e9;
    return amountInSUI !== 0
      ? `${amountInSUI > 0 ? "+" : ""}${amountInSUI.toFixed(4)} SUI`
      : "0 SUI";
  };

  return (
    <div className="w-full bg-card rounded-xl p-4 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        <span className="text-sm text-muted-foreground">
          Showing {Math.min(transactions.length, 10)} of {transactions.length} transactions
        </span>
      </div>
      {transactions.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">No transactions found</p>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-muted">
              <th className="py-3 px-3 text-left font-medium">Type</th>
              <th className="py-3 px-3 text-left font-medium">Date & Time</th>
              <th className="py-3 px-3 text-left font-medium">Amount</th>
              <th className="py-3 px-3 text-left font-medium">Gas Fee</th>
              <th className="py-3 px-3 text-left font-medium">Status</th>
              <th className="py-3 px-3 text-left font-medium">Transaction</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 10).map((tx) => {
              const { date, time } = formatDateTime(tx.timestamp);
              const netAmount = getNetAmount(tx.balanceChanges);
              const isPositive = netAmount.startsWith("+");

              return (
                <tr
                  key={tx.digest}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(tx.kind)}
                      <span className="font-medium">{getTransactionType(tx.kind, tx.events)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{date}</span>
                      <span className="text-xs text-muted-foreground">{time}</span>
                    </div>
                  </td>
                  <td
                    className={`py-3 px-3 font-medium ${
                      isPositive
                        ? "text-green-600 dark:text-green-400"
                        : netAmount === "0 SUI"
                        ? ""
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {netAmount}
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">-</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      Success
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <Link
                      href={`https://suiscan.xyz/mainnet/tx/${tx.digest}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary/70 font-medium hover:text-primary transition-colors inline-flex items-center gap-1"
                    >
                      {truncateHash(tx.digest)}
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
