"use client";
import { HomeIcon, Scan } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { PATHS } from "@/constants/routes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  className?: string;
}

interface Tab {
  title: string;
  icon: React.ReactNode;
  href: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const pathname = usePathname();

  const tabs: Tab[] = [
    {
      title: "Portfolio",
      icon: <HomeIcon className="h-5 w-5" />,
      href: PATHS.PORTFOLIO,
    },
    {
      title: "Scan",
      icon: <Scan className="h-5 w-5" />,
      href: "/scan",
    },
  ];

  return (
    <div className={cn("w-16 h-screen border-r bg-background fixed top-0 left-0", className)}>
      <nav className="flex flex-col items-center py-4 space-y-4">
        <TooltipProvider>
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;

            return (
              <Tooltip key={tab.title}>
                <TooltipTrigger asChild>
                  <Link
                    href={tab.href}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                    )}
                  >
                    {tab.icon}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{tab.title}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>
    </div>
  );
};

export default Sidebar;
