import { createClient } from "@/app/utils/supabase/server";
import handleError from "../handlers/error";

export async function getTools(params: PaginatedSearchParams): Promise<ActionResponse<{
    tools: Tool[];
  }>
  > {
  
    const supabase = await createClient()
  
    try {
  
      const tools = await supabase
        .from('tools')
        .select('*')
  
  
      return {
        success: true,
        data: {
          tools: tools.data ?? [],
        },
      };
  
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }
  }

export async function getTool(params: { 
  slug: string 
}): Promise<ActionResponse<{
  tool: Tool | null;
}>> {
  const { slug } = params;
  
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned (not found)
        return {
          success: true,
          data: {
            tool: null,
          },
        };
      }
      throw error;
    }
    
    return {
      success: true,
      data: {
        tool: data,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

/**
 * Gets a tool ID from its slug
 * @param params The parameters including the tool slug
 * @returns The tool ID or null if not found
 */
export async function getToolIdFromSlug(params: { 
  slug: string 
}): Promise<ActionResponse<{
  toolId: string | null;
}>> {
  const { slug } = params;
  
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('tools')
      .select('id')
      .eq('slug', slug)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned (not found)
        return {
          success: true,
          data: {
            toolId: null,
          },
        };
      }
      throw error;
    }
    
    return {
      success: true,
      data: {
        toolId: data.id,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

