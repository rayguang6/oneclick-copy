import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function getLoggedInUser() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login'); 

  return user;
}

/**
 * Get user's admin status
 */
export async function getAdminStatus() {
  const supabase = await createClient()
  const loggedInUser = await getLoggedInUser()
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', loggedInUser.id)
      .single()

    if (error) throw new Error('Failed to fetch profile: ' + error.message)
    
    return data?.role === 'admin'
  } catch (error) {
    console.error('getAdminStatus error:', error)
    return false
  }
}