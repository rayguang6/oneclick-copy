"use server"

import { ReactNode } from "react";
import Navbar from "@/app/components/navigation/Navbar";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <main className="bg-white dark:bg-gray-900 realtive">
      <Navbar />
      <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full">{children}</div>
        </section>
      
      {/* <main className="w-full">
        <div className="mx-auto w-full">
            {children}
        </div>
      </main> */}
    </main>
  );
};

export default RootLayout;