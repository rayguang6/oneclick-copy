import { ReactNode } from "react";
import Navbar from "@/app/components/navigation/Navbar";
import { getLoggedInUser } from "@/app/utils/supabase/getUser";
import { UserContextProvider } from "../context/UserContext";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const loggedInUser = await getLoggedInUser(); 
  return (
    <>
      {/* Only include Navbar here in the (root) layout, not in the top-level layout */}
      <Navbar />
      
      <main className="w-full overflow-hidden">
        <div className="mx-auto w-full ">
          <UserContextProvider user={loggedInUser}> 
            {children}
          </UserContextProvider>
        </div>
      </main>
    </>
  );
};

export default RootLayout;