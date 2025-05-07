"use server";

import handleServerError from "@/lib/handlers/error";
import { createClient } from "@/app/utils/supabase/server";
import logger from "../logger";
export type ResponseType = "api" | "server";

interface Project {
  id: string;
  name: string;
// Add other project fields as needed
}

// export async function getUserProjects(): Promise<Project[]> {
//   // TODO: Implement actual project fetching
//   console.log('Project fetching not implemented yet');
//   return [];
// } 


export async function getProjects(params: PaginatedSearchParams): Promise<ActionResponse<{
  projects: Project[];
  // isNext: boolean;
}>
>{

  const { page = 1, pageSize = 10, query, filter } = params;

  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  let sortCriteria = {};
  
  const supabase = await createClient()
  const currentUser = await supabase.auth.getUser()

  try {

    const projects = await supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .eq('user_id', currentUser.data.user?.id)
      .range(skip, skip + limit - 1);


    return {
      success: true,
      data: {
        projects: projects.data ?? [],
      },
    };
    
  } catch (error) {
    return handleServerError(error) as ErrorResponse;


    // logger.error({ err: error }, "An unexpected error occurred");
    // return {
    //   success: false,
    //   error: {
    //     message: "SERVER Error",
    //   },
    // };
    

  }

 
}