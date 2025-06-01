import { HomeIcon, Scan, SunMoon, Wallet } from "lucide-react";
import Link from "next/link";
import { Dock, DockIcon, DockItem, DockLabel } from "./dock";

const data = [
  {
    title: "Portfolio",
    icon: <HomeIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
    href: "/portfolio",
  },
  {
    title: "Scan",
    icon: <Scan className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
    href: "/scan",
  },
  {
    title: "Wallet",
    icon: <Wallet className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
    href: "/wallet",
  },
  {
    title: "Theme",
    icon: <SunMoon className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
    href: "#",
  },
];

export function Toolbar() {
  return (
    <div className="absolute bottom-2 left-1/2 max-w-full -translate-x-1/2">
      <Dock className="items-end pb-3">
        {data.map((item, idx) => (
          <Link href={item.href} key={idx}>
            <DockItem
              key={idx}
              className="aspect-square rounded-full bg-gray-200 dark:bg-neutral-800 cursor-pointer"
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>{item.icon}</DockIcon>
            </DockItem>
          </Link>
        ))}
      </Dock>
    </div>
  );
}
