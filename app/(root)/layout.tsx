"use server"

import { ReactNode } from "react";
import Navbar from "@/app/components/navigation/Navbar";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <html>
      <body className="flex flex-col h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <main className="flex-1 flex flex-col overflow-hidden pt-20">
          {children}
        </main>
      </body>
    </html>
  );
};

export default RootLayout;