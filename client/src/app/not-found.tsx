"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="w-full rounded-lg p-8 max-w-md bg-blue-500/50 border border-blue-500/20">
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-6xl font-bold text-blue-500">404</h1>
          <h2 className="text-2xl font-semibold text-white">Page Not Found</h2>
          <p className="text-gray-400">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/">
            <Button
              variant="outline"
              className="mt-4 border-blue-500/20 text-blue-500 hover:bg-blue-500/20"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
