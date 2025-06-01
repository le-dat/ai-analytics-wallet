"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Network } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const NETWORKS = [
  { id: "mainnet", name: "Mainnet", color: "text-green-500" },
  { id: "testnet", name: "Testnet", color: "text-yellow-500" },
  { id: "devnet", name: "Devnet", color: "text-blue-500" },
] as const;

export default function NetworkSelector() {
  const [currentNetwork, setCurrentNetwork] = useState("mainnet");

  useEffect(() => {
    // Get network from localStorage on mount
    const savedNetwork = localStorage.getItem("sui-network") || "mainnet";
    setCurrentNetwork(savedNetwork);
  }, []);

  const handleNetworkChange = (networkId: string) => {
    // Show toast notification
    toast.info(`Switching to ${networkId}...`);

    // Store selected network in localStorage
    localStorage.setItem("sui-network", networkId);
    setCurrentNetwork(networkId);

    // Reload to apply changes
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const network = NETWORKS.find((n) => n.id === currentNetwork) || NETWORKS[0];

  return (
    <div className="flex items-center gap-2">
      <Network className="h-4 w-4 text-muted-foreground" />
      <Select value={currentNetwork} onValueChange={handleNetworkChange}>
        <SelectTrigger className="w-[140px] h-9 bg-background/50 backdrop-blur border-muted-foreground/20">
          <SelectValue>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${network.color} animate-pulse`} />
              <span className="text-sm font-medium">{network.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {NETWORKS.map((net) => (
            <SelectItem key={net.id} value={net.id}>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${net.color}`} />
                <span>{net.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
