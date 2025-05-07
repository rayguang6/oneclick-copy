// app/layout.tsx (Root Layout)
"use server";

import { ReactNode } from "react";
import Navbar from "@/app/components/navigation/Navbar";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <html>
      <body className="flex flex-col h-screen bg-white dark:bg-gray-900 overflow-hidden">
        <Navbar />
        <main className="">
        <div className="mx-auto w-full pt-24">
        {/* <main className="flex-1 overflow-hidden pt-24 px-16">  */}
          {children}
        {/* </main> */}
        </div>
        </main>
      </body>
    </html>
  );
};

export default RootLayout;