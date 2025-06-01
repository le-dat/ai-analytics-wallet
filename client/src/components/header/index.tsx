import { Bot } from "lucide-react";
import ConnectWallet from "../wallet/connect-wallet";
import NetworkSelector from "../wallet/network-selector";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between rounded-full border border-border/50 bg-background/95 px-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">Crypto Agent</h1>
          </div>

          <div className="flex items-center gap-4">
            <ConnectWallet className="h-9" />
            <NetworkSelector />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
