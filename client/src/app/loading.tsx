import React from "react";
import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
