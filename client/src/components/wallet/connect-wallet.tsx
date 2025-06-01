"use client";

import { cn } from "@/lib/utils";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import WalletProfile from "./wallet-profile";

interface ConnectWalletProps {
  label?: string;
  className?: string;
}

const ConnectWallet = ({ className, label = "Launch App" }: ConnectWalletProps) => {
  const account = useCurrentAccount();

  if (account) {
    return <WalletProfile className={className} />;
  }

  return (
    <ConnectButton
      connectText={label}
      className={cn(
        "bg-gradient-to-r from-primary/60 cursor-pointer to-accent-foreground/20 hover:from-primary/20 hover:to-accent-foreground/10 hover:scale-105 transition-all rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    />
  );
};

export default ConnectWallet;
