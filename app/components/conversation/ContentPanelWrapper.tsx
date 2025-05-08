'use client'
import { useConversation } from '@/app/context/ConversationProvider'
import ContentPanel from '@/app/components/conversation/ContentPanel' // Adjust this import to your actual path
import { useState, useEffect } from 'react'

interface ContentPanelWrapperProps {
  toolConfig: Tool
  framework: string
  conversationChats?: Chat[]
  onToggleFavorite?: (chatId: string) => Promise<void>
}

export default function ContentPanelWrapper({
  toolConfig,
  framework,
  conversationChats = [],
  onToggleFavorite
}: ContentPanelWrapperProps) {
  const { isGenerating, streamingContent, streamingConversationId } = useConversation();
  const [sidebarOpen, setSidebarOpen] = useState(true); // You can add sidebar toggle logic if needed
  
  // Prepare a temporary chat when streaming
  const [tempChats, setTempChats] = useState<Chat[]>([]);
  
  // Update temp chats when streaming content changes
  useEffect(() => {
    if (streamingContent && streamingConversationId) {
      // Create or update a temporary chat
      const existingTempChat = tempChats.find(c => c.conversation_id === streamingConversationId);
      
      if (existingTempChat) {
        // Update existing temp chat
        setTempChats(prev => prev.map(c => 
          c.id === existingTempChat.id 
            ? { ...c, content: streamingContent } 
            : c
        ));
      } else {
        // Create new temp chat
        const newTempChat: Chat = {
          id: crypto.randomUUID(),
          conversation_id: streamingConversationId,
          role: 'system',
          content: streamingContent,
          created_at: new Date().toISOString(),
          is_favorite: false
        };
        
        setTempChats([newTempChat]);
      }
    }
  }, [streamingContent, streamingConversationId]);
  
  // Combine real chats with temp chats
  const allChats = streamingConversationId 
    ? tempChats 
    : conversationChats;
  
  return (
    <ContentPanel 
      toolConfig={toolConfig}
      framework={framework}
      isGenerating={isGenerating}
      sidebarOpen={sidebarOpen}
      streamingContent={streamingContent}
      streamingConversationId={streamingConversationId}
      activeConversationId={streamingConversationId}
      conversationChats={allChats}
      onToggleFavorite={onToggleFavorite}
    />
  );
}