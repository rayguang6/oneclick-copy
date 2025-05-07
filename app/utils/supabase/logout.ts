'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'
import { ROUTES } from '@/constants/routes'

export async function logout() {
  const supabase = await createClient()
  
  // Sign out the user
  await supabase.auth.signOut()
  
  // Redirect to home page
  redirect(ROUTES.HOME)
}