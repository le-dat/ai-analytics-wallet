"use client";

import React from "react";
import {
  Coins,
  Loader2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Wallet,
  Activity,
} from "lucide-react";
import ConnectWallet from "../wallet/connect-wallet";
import { PortfolioCard } from "./portfolio-card";
import { PortfolioChart } from "./portfolio-chart";
import { PortfolioDonutChart } from "./portfolio-donut-chart";
import { PortfolioTransactionTable } from "./portfolio-transaction-table";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Portfolio = () => {
  const account = useCurrentAccount();
  const { portfolio, gas, staking, isLoading, isError, error } = usePortfolioData();

  // Show loading state
  if (isLoading && account) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading portfolio data...</span>
      </div>
    );
  }

  // Show error state
  if (isError && account) {
    return (
      <div className="space-y-4 p-1">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load portfolio data: {error?.message || "Unknown error"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Calculate metrics
  const totalInSUI = portfolio?.summary?.totalInSUI || 0;
  const totalOutSUI = portfolio?.summary?.totalOutSUI || 0;
  const netFlow = totalInSUI - totalOutSUI;
  const gasSpent = parseFloat(gas?.totalGasSpent || "0");
  const avgGasPerTx = gas?.averageGasPerTx || "0";
  const nftsCount = portfolio?.summary?.numNFTs || 0;
  const tokensCount = portfolio?.summary?.numTokens || 0;
  const txCount = portfolio?.summary?.numTx || 0;
  const totalStaked = parseFloat(staking?.totalStaked || "0");
  const stakingAPY = staking?.estimatedAPY || "0";

  // Format numbers
  const formatSUI = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
    return value.toFixed(4);
  };

  return (
    <div className="space-y-4 max-h-screen overflow-y-auto p-1">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Portfolio Overview
          </span>
        </h1>
        <ConnectWallet />
      </div>

      {!account ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please connect your wallet to view portfolio data</AlertDescription>
        </Alert>
      ) : (
        <>
          {/* First row - Main metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <PortfolioCard
              title="Net Portfolio Value"
              value={`${formatSUI(netFlow)} SUI`}
              icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
              description={netFlow >= 0 ? "Net positive flow" : "Net negative flow"}
              trend={netFlow >= 0 ? "up" : "down"}
              trendValue={`${((Math.abs(netFlow) / (totalInSUI || 1)) * 100).toFixed(1)}%`}
            />
            <PortfolioCard
              title="Total Staked"
              value={`${formatSUI(totalStaked)} SUI`}
              icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
              description={`APY: ${stakingAPY}%`}
              trend="up"
              trendValue={`${stakingAPY}%`}
            />
            <PortfolioCard
              title="Gas Efficiency"
              value={`${gas?.gasEfficiency || 0}/100`}
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
              description={`Avg: ${avgGasPerTx} SUI/tx`}
              trend={gas?.gasEfficiency && gas.gasEfficiency > 70 ? "up" : "down"}
            />
            <PortfolioCard
              title="Total Assets"
              value={`${tokensCount + nftsCount}`}
              icon={<Coins className="h-4 w-4 text-muted-foreground" />}
              description={`${tokensCount} tokens, ${nftsCount} NFTs`}
            />
          </div>

          {/* Second row - Flow metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <PortfolioCard
              title="Total Inflow"
              value={`${formatSUI(totalInSUI)} SUI`}
              icon={<TrendingUp className="h-4 w-4 text-green-500" />}
              description="Total received"
              className="border-green-500/20"
            />
            <PortfolioCard
              title="Total Outflow"
              value={`${formatSUI(totalOutSUI)} SUI`}
              icon={<TrendingDown className="h-4 w-4 text-red-500" />}
              description="Total sent"
              className="border-red-500/20"
            />
            <PortfolioCard
              title="Transaction Count"
              value={txCount.toString()}
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
              description={`Gas spent: ${formatSUI(gasSpent)} SUI`}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full">
            <PortfolioChart data={portfolio} />
            <PortfolioDonutChart data={portfolio} />
          </div>
          <PortfolioTransactionTable
            transactions={portfolio?.txs || []}
            portfolioData={portfolio}
          />
        </>
      )}
    </div>
  );
};

export default Portfolio;
