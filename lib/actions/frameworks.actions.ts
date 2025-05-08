// lib/actions/conversation.actions.ts
"use server";

import { createClient } from "@/app/utils/supabase/server";
import handleError from "@/lib/handlers/error";

export async function getFrameworks(params: {
  toolSlug: string;
}): Promise<ActionResponse<{ framework: Framework[] }>> {
  const { toolSlug } = params;

  try {
    const supabase = await createClient();
    const currentUser = await supabase.auth.getUser();
    
    // Get tool ID from slug
    const { data: tool } = await supabase
      .from('tools')
      .select('id')
      .eq('slug', toolSlug)
      .single();
      
    if (!tool) {
      throw new Error('Tool not found');
    }
    
    // Fetch conversations
    const frameworks = await supabase
      .from('frameworks')
      .select('*')
      .eq('tool_id', tool.id)
      
    if (!frameworks) throw new Error("Frameworks not found");

    return {
      success: true,
      data: { 
        framework: frameworks.data ?? [] 
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

