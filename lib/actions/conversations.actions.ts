// lib/actions/conversation.actions.ts
"use server";

import { createClient } from "@/app/utils/supabase/server";
import handleError from "@/lib/handlers/error";

export async function getConversations(params: {
  projectId: string;
  toolSlug: string;
}): Promise<ActionResponse<{ conversations: Conversation[] }>> {
  const { projectId, toolSlug } = params;

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
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('id, title')
      .eq('project_id', projectId)
      .eq('tool_id', tool.id)
      .eq('user_id', currentUser.data.user?.id)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return {
      success: true,
      data: { conversations: conversations || [] }
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createConversation(params: {
  projectId: string;
  toolSlug: string;
  title?: string;
}): Promise<ActionResponse<{ conversation: Conversation }>> {
  const { projectId, toolSlug, title = 'New Conversation' } = params;

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
    
    // Create conversation
    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert({
        title,
        project_id: projectId,
        tool_id: tool.id,
        user_id: currentUser.data.user?.id,
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      success: true,
      data: { conversation }
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}