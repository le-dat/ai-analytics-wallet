"use client";

import React from "react";
import {
  Coins,
  Loader2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  Zap,
  Network,
  Cpu,
  Hash,
  Clock,
  Link2,
  Layers,
} from "lucide-react";
import ConnectWallet from "../wallet/connect-wallet";
import { PortfolioCard } from "./portfolio-card";
import { PortfolioChart } from "./portfolio-chart";
import { PortfolioDonutChart } from "./portfolio-donut-chart";
import { PortfolioTransactionTable } from "./portfolio-transaction-table";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Portfolio = () => {
  const account = useCurrentAccount();
  const { portfolio, gas, staking, isLoading, isError, error } = usePortfolioData();

  // Get network name safely (only in browser)
  const getNetworkName = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem("sui-network") || "mainnet";
    }
    return "mainnet";
  };

  // Show loading state with Web3 style
  if (isLoading && account) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-gradient-to-r from-primary/20 to-blue-500/20 animate-pulse" />
          <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
        </div>
        <p className="mt-4 text-muted-foreground font-mono">Syncing blockchain data...</p>
      </div>
    );
  }

  // Show error state
  if (isError && account) {
    return (
      <div className="space-y-4 p-1">
        <Alert variant="destructive" className="border-red-500/50 bg-red-950/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-mono">
            RPC Error: {error?.message || "Failed to fetch on-chain data"}
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

  // Format numbers with blockchain precision
  const formatSUI = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(6)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(4)}K`;
    return value.toFixed(9);
  };

  // Format address
  const formatAddress = (address: string | undefined) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-6 max-h-screen overflow-y-auto p-1">
      {/* Header with Web3 styling */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-blue-500/10 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent animate-gradient">
                DeFi Portfolio
              </span>
              <Badge variant="outline" className="font-mono text-xs border-primary/50">
                <Network className="h-3 w-3 mr-1" />
                SUI {getNetworkName().toUpperCase()}
              </Badge>
            </h1>
            {account && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                <Hash className="h-3 w-3" />
                <span>{formatAddress(account.address)}</span>
                <Badge variant="secondary" className="text-xs">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-1" />
                  Active
                </Badge>
              </div>
            )}
          </div>
          <ConnectWallet />
        </div>
      </div>

      {!account ? (
        <Alert className="border-primary/50 bg-primary/5 backdrop-blur">
          <Shield className="h-4 w-4" />
          <AlertDescription className="font-mono">
            Connect wallet to access on-chain portfolio analytics
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Main metrics with blockchain aesthetic */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <PortfolioCard
              title="Total Value Locked"
              value={`${formatSUI(netFlow)} SUI`}
              icon={<Layers className="h-4 w-4 text-primary" />}
              description={
                <span className="font-mono text-xs">
                  {netFlow >= 0 ? "↑ Positive P&L" : "↓ Negative P&L"}
                </span>
              }
              trend={netFlow >= 0 ? "up" : "down"}
              trendValue={`${((Math.abs(netFlow) / (totalInSUI || 1)) * 100).toFixed(2)}%`}
              className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent"
            />
            <PortfolioCard
              title="Staking Position"
              value={`${formatSUI(totalStaked)} SUI`}
              icon={<Cpu className="h-4 w-4 text-blue-500" />}
              description={
                <span className="font-mono text-xs flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  APY: {stakingAPY}%
                </span>
              }
              trend="up"
              trendValue={`+${stakingAPY}%`}
              className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent"
            />
            <PortfolioCard
              title="Gas Optimization"
              value={`${gas?.gasEfficiency || 0}%`}
              icon={<Activity className="h-4 w-4 text-green-500" />}
              description={<span className="font-mono text-xs">Ø {avgGasPerTx} SUI/tx</span>}
              trend={gas?.gasEfficiency && gas.gasEfficiency > 70 ? "up" : "down"}
              className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent"
            />
            <PortfolioCard
              title="On-Chain Assets"
              value={`${tokensCount + nftsCount}`}
              icon={<Coins className="h-4 w-4 text-yellow-500" />}
              description={
                <div className="font-mono text-xs space-y-1">
                  <span className="block">ERC-20: {tokensCount}</span>
                  <span className="block">NFTs: {nftsCount}</span>
                </div>
              }
              className="border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-transparent"
            />
          </div>

          <Separator className="bg-primary/10" />

          {/* Flow metrics with DeFi styling */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <PortfolioCard
              title="Total Inflow"
              value={`${formatSUI(totalInSUI)}`}
              icon={<TrendingUp className="h-4 w-4 text-green-500" />}
              description={<span className="font-mono text-xs text-green-500">↗ Received</span>}
              className="border-green-500/30 bg-gradient-to-br from-green-950/20 to-green-950/5"
            />
            <PortfolioCard
              title="Total Outflow"
              value={`${formatSUI(totalOutSUI)}`}
              icon={<TrendingDown className="h-4 w-4 text-red-500" />}
              description={<span className="font-mono text-xs text-red-500">↘ Sent</span>}
              className="border-red-500/30 bg-gradient-to-br from-red-950/20 to-red-950/5"
            />
            <PortfolioCard
              title="TX Count"
              value={txCount.toString()}
              icon={<Link2 className="h-4 w-4 text-purple-500" />}
              description={
                <span className="font-mono text-xs">Gas: {formatSUI(gasSpent)} SUI</span>
              }
              className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent"
            />
            <PortfolioCard
              title="Block Activity"
              value="24h"
              icon={<Clock className="h-4 w-4 text-cyan-500" />}
              description={
                <span className="font-mono text-xs">Last: {new Date().toLocaleTimeString()}</span>
              }
              className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent"
            />
          </div>

          {/* Charts with dark theme */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-lg" />
              <PortfolioChart data={portfolio} />
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-lg" />
              <PortfolioDonutChart data={portfolio} />
            </div>
          </div>

          {/* Transaction table with blockchain styling */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent rounded-lg" />
            <PortfolioTransactionTable
              transactions={portfolio?.txs || []}
              portfolioData={portfolio}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Portfolio;
