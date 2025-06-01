"use client";

import { createNetworkConfig, SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@mysten/dapp-kit/dist/index.css";
import RouteGuard from "./route-guard";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl("localnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
  testnet: { url: getFullnodeUrl("testnet") },
  devnet: { url: getFullnodeUrl("devnet") },
});
const queryClient = new QueryClient();

interface ProviderProps {
  children: React.ReactNode;
}

export default function AppProvider({ children }: ProviderProps) {
  const [selectedNetwork, setSelectedNetwork] = useState<"mainnet" | "testnet" | "devnet">(
    "mainnet"
  );

  useEffect(() => {
    // Get network from localStorage on mount
    const savedNetwork = localStorage.getItem("sui-network") as
      | "mainnet"
      | "testnet"
      | "devnet"
      | null;
    if (savedNetwork && ["mainnet", "testnet", "devnet"].includes(savedNetwork)) {
      setSelectedNetwork(savedNetwork);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork={selectedNetwork}>
        <WalletProvider autoConnect>
          <RouteGuard>
            <Toaster />
            {children}
          </RouteGuard>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
