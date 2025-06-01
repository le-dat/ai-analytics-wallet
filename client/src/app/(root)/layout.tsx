import Chat from "@/components/chat";
import Sidebar from "@/components/sidebar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="max-w-[calc(100vw-600px)] ml-[64px] w-full p-4">{children}</div>
      <Sidebar />
      <Chat />
    </div>
  );
};

export default Layout;
