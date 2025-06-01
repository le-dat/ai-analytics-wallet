import { Button } from "@/components/ui/button";

interface QuickPromptsProps {
  onPromptClick: (prompt: string) => void;
  isVisible?: boolean;
}

const quickPrompts = [
  { text: "Portfolio analysis", prompt: "Analyze my portfolio" },
  { text: "Gas optimization", prompt: "How to optimize gas fees?" },
  { text: "Staking advice", prompt: "Should I stake more SUI?" },
  { text: "Tax report", prompt: "Show my tax summary" },
];

export function QuickPrompts({ onPromptClick, isVisible = true }: QuickPromptsProps) {
  if (!isVisible) return null;

  return (
    <div className="flex gap-2 px-3 pb-2 overflow-x-auto scrollbar-none">
      {quickPrompts.map((prompt, index) => (
        <Button
          key={index}
          variant="secondary"
          size="sm"
          className="text-xs whitespace-nowrap"
          onClick={() => onPromptClick(prompt.prompt)}
        >
          {prompt.text}
        </Button>
      ))}
    </div>
  );
}
