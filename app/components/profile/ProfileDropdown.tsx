// app/components/navigation/ProfileDropdown.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { logout } from "@/app/utils/supabase/logout";

export default function ProfileDropdown({ id, name, imageUrl }: { id: string, name: string, imageUrl?: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setOpen((o) => !o)} 
        className="focus:outline-none cursor-pointer"
      >
        <UserAvatar id={id} name={name} imageUrl={imageUrl} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg z-50">
          <Link 
            href={ROUTES.PROFILE(id)} 
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
          >
            Profile
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
            >
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}