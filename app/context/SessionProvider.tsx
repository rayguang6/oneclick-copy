"use client";
import { SessionContext } from "./SessionContext";

export default function SessionProvider({ user, children }: { user: any, children: React.ReactNode }) {
  return (
    <SessionContext.Provider value={user}>
      {children}
    </SessionContext.Provider>
  );
} 