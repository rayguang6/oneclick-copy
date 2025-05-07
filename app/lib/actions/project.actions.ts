import { PaginatedSearchParams } from "@/app/types/global";
import { createClient } from "@/app/utils/supabase/server";

interface Project {
  id: string;
  name: string;
  // Add other project fields as needed
}

export async function getUserProjects(): Promise<Project[]> {
  // TODO: Implement actual project fetching
  console.log('Project fetching not implemented yet');
  return [];
} 


export async function getProjects(){
  
  const supabase = await createClient()
  const currentUser = await supabase.auth.getUser()
  console.log("Current User from Get Projects")
  console.log(currentUser.data.user)
  console.log("Current User ID from Get Projects")
  console.log(currentUser.data.user?.id)

  try {
    const projects = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', currentUser.data.user?.id)
    
    //const totalAnswers

    return {
      success: true,
      data: projects,
      error: null,
    }

  } catch (error) {
    return {
      success: false,
      data: null,
      error: error,
    };
  }
}