import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { ROUTES } from '@/constants/routes'
import { createClient } from '@/app/utils/supabase/server'
import UserAvatar from '../UserAvatar'
import ProfileDropdown from '@/app/components/profile/ProfileDropdown'
import NavLinks from './NavLinks'

const Navbar = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="flex-between background-light900_dark200 sticky top-0 z-50 w-full gap-5 p-4 shadow-md dark:shadow-none sm:px-12">
    <Link href={ROUTES.HOME} className="flex items-center gap-1">
      <Image
        src="/images/logo.png"
        width={120}
        height={120}
        alt="One Click Copy Logo"
      />
      {/* <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
        Dev<span className="text-primary-500">Overflow</span>
      </p> */}
    </Link>

    {/* Nav Links */}
    <div className="hidden md:flex items-center justify-center flex-1 px-8">
      <div className="flex space-x-1">
        <NavLinks userId={user?.id} />
      </div>
    </div>

    <div className="flex-between gap-5">
      {user?.id && (
        <>  
        <ProfileDropdown 
          id={user.id}
          name={user.email!}
          // imageUrl={session.user?.image}
        />
        {/* <UserAvatar
          id={session.user.id}
          name={session.user.email!}
          // imageUrl={session.user?.image}
        /> */}
        </>
      )} 
    </div>
  </nav>
    
  )
}

export default Navbar