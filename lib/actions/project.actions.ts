"use server";

import handleError from "@/lib/handlers/error";
import { createClient } from "@/app/utils/supabase/server";
import logger from "../logger";
import { cache } from "react";
import action from "../handlers/action";
import { GetProjectSchema } from "../validations";
export type ResponseType = "api" | "server";


// export async function getUserProjects(): Promise<Project[]> {
//   // TODO: Implement actual project fetching
//   console.log('Project fetching not implemented yet');
//   return [];
// } 


export async function getProjects(params: PaginatedSearchParams): Promise<ActionResponse<{
  projects: Project[];
  // isNext: boolean;
}>
> {

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
    return handleError(error) as ErrorResponse;
  }
}


// export const getProjectById = cache(async function getProjectById(
//   params: GetProjectParams
// ): Promise<ActionResponse<Project>> {

//   const { projectId } = params;
  
//   try {
//     const supabase = await createClient()
//     const currentUser = await supabase.auth.getUser()

//     const project = await supabase
//       .from('projects')
//       .select('*')
//       .eq('id', projectId)
//       .single();

//     if (!project) throw new Error("Project not found");

//     return { success: true, data: JSON.parse(JSON.stringify(project)) };
//   } catch (error) {
//     return handleError(error) as ErrorResponse;
//   }    
// })




// Example of getQuestion function using the reusable action
export const getProject = cache(async function getProject(
  params: GetProjectParams
): Promise<ActionResponse<Project>> {
  const actionResult = await action({
    params,
    schema: GetProjectSchema,
  });

  if (actionResult instanceof Error) {
    return handleError(actionResult) as ErrorResponse;
  }

  const { projectId } = actionResult.params!;
  const { supabase } = actionResult;

  try {
    const project = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (!project) throw new Error("Project not found");


    return { success: true, data: project.data };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
});