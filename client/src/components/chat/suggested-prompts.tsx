import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  Wallet,
  Fuel,
  Coins,
  Receipt,
  BarChart3,
  Sparkles,
  HelpCircle,
} from "lucide-react";

interface SuggestedPromptsProps {
  onPromptClick: (prompt: string) => void;
  isVisible?: boolean;
}

const prompts = [
  {
    icon: <TrendingUp className="h-4 w-4" />,
    text: "Analyze my portfolio performance",
    prompt: "Give me a comprehensive analysis of my portfolio performance and growth potential",
  },
  {
    icon: <Fuel className="h-4 w-4" />,
    text: "How to optimize gas fees?",
    prompt: "How can I optimize my gas fees and reduce transaction costs?",
  },
  {
    icon: <Coins className="h-4 w-4" />,
    text: "Staking recommendations",
    prompt: "What are your staking recommendations to maximize my passive income?",
  },
  {
    icon: <Receipt className="h-4 w-4" />,
    text: "Tax optimization strategies",
    prompt: "What tax optimization strategies should I consider for my crypto portfolio?",
  },
  {
    icon: <BarChart3 className="h-4 w-4" />,
    text: "Investment opportunities",
    prompt: "What are the best investment opportunities in the Sui ecosystem right now?",
  },
  {
    icon: <Wallet className="h-4 w-4" />,
    text: "Portfolio diversification",
    prompt: "How should I diversify my portfolio for better risk management?",
  },
  {
    icon: <Sparkles className="h-4 w-4" />,
    text: "DeFi strategies",
    prompt: "What DeFi strategies can help me maximize returns on Sui?",
  },
  {
    icon: <HelpCircle className="h-4 w-4" />,
    text: "Risk assessment",
    prompt: "Assess the risk level of my current portfolio and suggest improvements",
  },
];

export function SuggestedPrompts({ onPromptClick, isVisible = true }: SuggestedPromptsProps) {
  if (!isVisible) return null;

  return (
    <div className="w-full px-4 pb-4">
      <p className="text-sm text-muted-foreground mb-3">Suggested questions:</p>
      <div className="grid grid-cols-2 gap-2">
        {prompts.map((prompt, index) => (
          <Card
            key={index}
            className="p-3 cursor-pointer hover:bg-accent transition-colors group"
            onClick={() => onPromptClick(prompt.prompt)}
          >
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start p-0 h-auto font-normal hover:bg-transparent"
            >
              <div className="flex items-center gap-2">
                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                  {prompt.icon}
                </div>
                <span className="text-xs text-left">{prompt.text}</span>
              </div>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
