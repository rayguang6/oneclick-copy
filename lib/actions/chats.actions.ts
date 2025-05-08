'use server'

import { createClient } from '@/app/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// This file contains server actions for chats
// It's marked with 'use server' at the top, so it can be imported in client components

export async function getChatMessages({ 
  conversationId 
}: { 
  conversationId: string; 
}) {
  try {
    const supabase = await createClient();
    
    // Fetch messages for this conversation
    const { data: chats, error } = await supabase
      .from('chats')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    return {
      success: true,
      data: { chats: chats || [] },
    };
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function saveChatMessage({
  conversationId,
  content,
  role,
}: {
  conversationId: string;
  content: string;
  role: 'user' | 'system';
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
    
    const { data, error } = await supabase
      .from('chats')
      .insert([{ 
        conversation_id: conversationId, 
        content, 
        role,
        user_id: user.id
      }])
      .select()
      .single();
      
    if (error) throw error;
    
    // Revalidate the conversation page
    revalidatePath(`/projects/[projectId]/tools/[toolSlug]/conversations/${conversationId}`);
    
    return {
      success: true,
      data: { chat: data },
    };
  } catch (error) {
    console.error('Error saving chat message:', error);
    return {
      success: false,
      error: error.message
    };
  }
}