"use server"

import { ReactNode } from "react";
import Navbar from "@/app/components/navigation/Navbar";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      
      <main className="w-full">
        <div className="mx-auto w-full">
            {children}
        </div>
      </main>
    </>
  );
};

export default RootLayout;