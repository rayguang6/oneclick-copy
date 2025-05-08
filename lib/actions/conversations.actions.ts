'use server'

import { createClient } from '@/app/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// This file contains server actions for conversations
// It's marked with 'use server' at the top, so it can be imported in client components

export async function getConversations({ 
  projectId, 
  toolSlug 
}: { 
  projectId: string; 
  toolSlug: string; 
}) {
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
    const conversations = await supabase
      .from('conversations')
      .select('*')
      .eq('project_id', projectId)
      .eq('tool_id', tool.id)
      .eq('user_id', currentUser.data.user?.id)
      .order('created_at', { ascending: false });
      
    if (!conversations) throw new Error("Conversations not found");

    return {
      success: true,
      data: { 
        conversations: conversations.data ?? [] 
      },
    };
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function getConversation({ 
  conversationId 
}: { 
  conversationId: string; 
}) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();
      
    if (error) throw error;
    
    return {
      success: true,
      data: { conversation: data },
    };
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function createConversationWithMessages({
  projectId,
  toolId,
  framework,
  title,
  userPrompt,
  systemResponse,
}: {
  projectId: string;
  toolId: string;
  framework: string;
  title: string;
  userPrompt: string;
  systemResponse: string;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { 
        success: false, 
        error: 'User not authenticated' 
      };
    }

    // 1. Create conversation
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .insert([
        {
          project_id: projectId,
          tool_id: toolId,
          user_id: user.id,
          title: title || 'New Conversation',
          framework: framework || ''
        }
      ])
      .select()
      .single();
    
    if (conversationError) {
      console.error('Error creating conversation:', conversationError);
      return { 
        success: false, 
        error: conversationError.message 
      };
    }

    // 2. Create user message
    const { data: userChat, error: userMessageError } = await supabase
      .from('chats')
      .insert([
        {
          conversation_id: conversation.id,
          role: 'user',
          content: userPrompt,
          user_id: user.id
        }
      ])
      .select()
      .single();
    
    if (userMessageError) {
      console.error('Error creating user message:', userMessageError);
      return { 
        success: false, 
        error: userMessageError.message 
      };
    }

    // 3. Create system message
    const { data: systemChat, error: systemMessageError } = await supabase
      .from('chats')
      .insert([
        {
          conversation_id: conversation.id,
          role: 'system',
          content: systemResponse,
          user_id: user.id
        }
      ])
      .select()
      .single();
    
    if (systemMessageError) {
      console.error('Error creating system message:', systemMessageError);
      return { 
        success: false, 
        error: systemMessageError.message 
      };
    }
    
    // Revalidate the conversations page to refresh the list
    revalidatePath(`/projects/${projectId}/tools/${toolSlug}`);

    // Return success with conversation and messages
    return {
      success: true,
      data: {
        conversation,
        userChat,
        systemChat
      }
    };
    
  } catch (error) {
    console.error('Unexpected error in saveConversation:', error);
    return {
      success: false,
      error: 'Internal server error'
    };
  }
}

// Function to get a tool ID from a slug
export async function getToolIdFromSlug(slug: string) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('tools')
      .select('id')
      .eq('slug', slug)
      .single();
      
    if (error) throw error;
    
    return {
      success: true,
      data: { toolId: data.id },
    };
  } catch (error) {
    console.error('Error fetching tool ID:', error);
    return {
      success: false,
      error: error.message
    };
  }
}