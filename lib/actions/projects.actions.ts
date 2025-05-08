"use server";

import handleError from "@/lib/handlers/error";
import { createClient } from "@/app/utils/supabase/server";
import logger from "../logger";
import { cache } from "react";
import action from "../handlers/action";
import { GetProjectSchema } from "../validations";
import { revalidatePath } from "next/cache";

export type ResponseType = "api" | "server";


// export async function getUserProjects(): Promise<Project[]> {
//   // TODO: Implement actual project fetching
//   return [];
// } 


export async function getProjects(params: PaginatedSearchParams): Promise<ActionResponse<{
    projects: Project[];
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


export async function updateProject(id: string, formData: Partial<Project>) {
  const supabase = await createClient()
  const currentUser = await supabase.auth.getUser()
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .update(formData)
      .eq('id', id)
      .eq('user_id', currentUser.data.user?.id) // Security: ensure user owns project
      .select()

    if (error) throw new Error('Failed to update project: ' + error.message)
    
    // Only revalidate the project page to avoid unnecessary refreshes
    revalidatePath(`/project/${id}`)
    
    return data[0] as Project
  } catch (error) {
    console.error('updateProject error:', error)
    throw error
  }
}

/**
 * Delete a project
 */
export async function deleteProject(id: string) {
  const supabase = await createClient()
  const currentUser = await supabase.auth.getUser()

  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', currentUser.data.user?.id) // Security: ensure user owns project

    if (error) throw new Error('Failed to delete project: ' + error.message)
    
    // Only need to revalidate home page after deletion
    revalidatePath('/')
  } catch (error) {
    console.error('deleteProject error:', error)
    throw error
  }
}

/**
 * Create a new project
 */
export async function createProject(formData: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...formData,
        user_id: user.id
      })
      .select()
      .single()

    if (error) throw new Error('Failed to create project: ' + error.message)
    
    // Revalidate the home page to show the new project
    revalidatePath('/')
    
    return data as Project
  } catch (error) {
    console.error('createProject error:', error)
    throw error
  }
}