export const PATHS = {
  LANDING_PAGE: "/",
  PORTFOLIO: "/portfolio",
  SCAN: "/scan",

  NEXT: "/_next",
  FAVICON: "/favicon.ico",
  ROBOTS: "/robots.txt",
};

export const PUBLIC_PATHS = [PATHS.LANDING_PAGE, PATHS.NEXT, PATHS.FAVICON, PATHS.ROBOTS];

export const PROTECTED_PATHS = [PATHS.PORTFOLIO, PATHS.SCAN];
