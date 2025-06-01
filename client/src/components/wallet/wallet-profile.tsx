/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";
import { Copy, LogOut, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import NetworkSelector from "./network-selector";

interface WalletProfileProps {
  name?: string;
  email?: string;
  className?: string;
}

const WalletProfile = ({ name, email, className }: WalletProfileProps) => {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const [hasImageError, setHasImageError] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleCopyAddress = async () => {
    if (!account?.address) return;
    try {
      await navigator.clipboard.writeText(account.address);
      toast.success("Address copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy address");
    }
  };

  if (!account) {
    return (
      <Button
        className={cn(
          "bg-gradient-to-r from-primary/60 cursor-pointer to-accent-foreground/20 hover:from-primary/20 hover:to-accent-foreground/10 hover:scale-105 transition-all",
          className
        )}
      >
        <span className="font-mono text-sm">Connect Wallet</span>
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "bg-gradient-to-r from-primary/60 cursor-pointer to-accent-foreground/20 hover:from-primary/10 hover:to-accent-foreground/10 hover:scale-105 transition-all",
            className
          )}
        >
          <span className="font-mono text-sm">{formatAddress(account.address)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-lg shadow-lg border-border/50" align="end">
        <div className="flex flex-col">
          {/* Header with Avatar and Name */}
          <div className="flex items-center gap-3 p-4 border-b border-border/50">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {name ? (
                <span className="text-lg font-medium text-primary">
                  {name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {hasImageError ? (
                    <User className="w-8 h-8 text-muted-foreground" />
                  ) : (
                    <Image
                      src={`https://api.dicebear.com/7.x/identicon/svg?seed=${account.address}`}
                      alt="avatar"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      priority
                      onError={() => setHasImageError(true)}
                    />
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-medium truncate">{name || "Anonymous"}</span>
              {email && <span className="text-sm text-muted-foreground truncate">{email}</span>}
            </div>
          </div>

          {/* Wallet Address */}
          <div className="p-4 border-b border-border/50">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Connected Address
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm break-all">{account.address}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyAddress}
                  className="h-8 w-8 shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <NetworkSelector />
          </div>

          {/* Logout Button */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => disconnect()}
            className="flex items-center gap-2 p-4 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-none"
          >
            <LogOut className="h-4 w-4" />
            <span>Disconnect Wallet</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WalletProfile;
