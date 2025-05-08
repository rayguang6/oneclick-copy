'use client';
import { createContext, useContext } from 'react';

type User = {
  id: string;
  email?: string;
  [key: string]: any;
};

const UserContext = createContext<User | null>(null);

export function UserContextProvider({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useLoggedInUser(): User {
  const user = useContext(UserContext);
  if (!user) throw new Error('useLoggedInUser must be inside <UserContextProvider>');
  return user;
}
