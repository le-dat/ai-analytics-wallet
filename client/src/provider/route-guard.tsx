"use client";

import { PATHS, PROTECTED_PATHS, PUBLIC_PATHS } from "@/constants/routes";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

function isPublicPath(path: string): boolean {
  return PUBLIC_PATHS.some(
    (publicPath) => path === publicPath || path.startsWith(publicPath + "/")
  );
}

function isProtectedPath(path: string): boolean {
  return PROTECTED_PATHS.some(
    (protectedPath) => path === protectedPath || path.startsWith(protectedPath + "/")
  );
}

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const account = useCurrentAccount();

  useEffect(() => {
    if (account && isPublicPath(pathname)) {
      const callback = new URLSearchParams(window.location.search).get("callback");
      router.replace(callback ?? PATHS.PORTFOLIO);
      router.refresh();
    }
    if (!account && isProtectedPath(pathname)) {
      router.replace(`${PATHS.LANDING_PAGE}?callback=${encodeURIComponent(pathname)}`);
      router.refresh();
    }
  }, [account, pathname, router]);

  return <>{children}</>;
}

export default RouteGuard;
