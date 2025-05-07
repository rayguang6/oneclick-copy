// lib/actions/chat.actions.ts
"use server";

import { createClient } from "@/app/utils/supabase/server";
import handleError from "@/lib/handlers/error";

type Message = {
  id: string;
  conversation_id: string;
  role: 'user' | 'system';
  content: string;
  created_at: string;
};

export async function getChatMessages(params: {
  conversationId: string;
}): Promise<ActionResponse<{ messages: Message[] }>> {
  const { conversationId } = params;

  try {
    const supabase = await createClient();
    
    // Fetch messages for this conversation
    const { data: messages, error } = await supabase
      .from('chats')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    return {
      success: true,
      data: { messages: messages || [] }
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function sendMessage(params: {
  conversationId: string;
  content: string;
}): Promise<ActionResponse<{ message: Message }>> {
  const { conversationId, content } = params;

  try {
    const supabase = await createClient();
    const currentUser = await supabase.auth.getUser();
    
    // Add user message
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: 'user',
        content,
        user_id: currentUser.data.user?.id,
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // In a real app, you would call an AI service here
    // For MVP, we'll simulate an AI response
    const { data: aiMessage } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: 'system',
        content: `This is a simulated response to: "${content}"`,
      })
      .select()
      .single();
    
    return {
      success: true,
      data: { message }
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}