"use client";

import { useQuery } from "@tanstack/react-query";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { getPortfolio, getGasData, getStakingData } from "@/lib/api";

export function usePortfolioData() {
  const account = useCurrentAccount();
  const address = account?.address;

  const portfolioQuery = useQuery({
    queryKey: ["portfolio", address],
    queryFn: () => getPortfolio(address!),
    enabled: !!address,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const gasQuery = useQuery({
    queryKey: ["gas", address],
    queryFn: () => getGasData(address!),
    enabled: !!address,
    refetchInterval: 30000,
  });

  const stakingQuery = useQuery({
    queryKey: ["staking", address],
    queryFn: () => getStakingData(address!),
    enabled: !!address,
    refetchInterval: 30000,
  });

  return {
    portfolio: portfolioQuery.data,
    gas: gasQuery.data,
    staking: stakingQuery.data,
    isLoading: portfolioQuery.isLoading || gasQuery.isLoading || stakingQuery.isLoading,
    isError: portfolioQuery.isError || gasQuery.isError || stakingQuery.isError,
    error: portfolioQuery.error || gasQuery.error || stakingQuery.error,
    refetch: () => {
      portfolioQuery.refetch();
      gasQuery.refetch();
      stakingQuery.refetch();
    },
  };
}
