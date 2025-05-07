// app/components/conversation/ConversationSidebar.tsx
'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getConversations, createConversation } from '@/lib/actions/conversations.actions';
import DataRenderer from '@/app/components/DataRenderer';
import { EMPTY_CONVERSATIONS } from '@/constants/states';
import { ROUTES } from '@/constants/routes';
type ConversationSidebarProps = {
  projectId: string;
  toolSlug: string;
};

type Conversation = {
  id: string;
  title: string;
};

export default function ConversationSidebar({ projectId, toolSlug }: ConversationSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  // Get active conversation ID from URL
  const activeConversationId = pathname.includes('/conversations/') 
    ? pathname.split('/conversations/')[1]
    : null;
  
  // Fetch conversations
  useEffect(() => {
    async function fetchConversations() {
      try {
        setLoading(true);
        const result = await getConversations({ projectId, toolSlug });
        
        if (result.success && result.data) {
          setConversations(result.data.conversations);
        } else {
          setError(result.error || 'Failed to fetch conversations');
        }
      } catch (error) {
        setError('An unexpected error occurred');
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchConversations();
  }, [projectId, toolSlug]);
  
  // Create new conversation
  const handleNewChat = async () => {
    try {
      const result = await createConversation({ 
        projectId, 
        toolSlug, 
        title: 'New Conversation' 
      });
      
      if (result.success && result.data?.conversation) {
        // Navigate to the new conversation
        router.push(ROUTES.CONVERSATION(projectId, toolSlug, result.data.conversation.id));
      } else {
        setError(result.error || 'Failed to create conversation');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      setError('An unexpected error occurred');
    }
  };
  
  return (
    <div className="w-64 border-r border-gray-200 bg-white h-full flex flex-col">
      {/* Header with back link */}
      <div className="p-3 border-b border-gray-200">
        <Link 
          href={ROUTES.PROJECT(projectId)} 
          className="text-sm text-gray-600 hover:text-blue-600"
        >
          Back to Project   
        </Link>
      </div>
      
      {/* New Chat button */}
      <div className="p-3">
        <button 
          onClick={handleNewChat}
          className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-sm"
        >
          + New Chat
        </button>
      </div>
      
      {/* Conversation list using DataRenderer */}
      <div className="flex-1 overflow-y-auto">
        <DataRenderer
          success={!error}
          error={error}
          data={conversations}
          loading={loading}
          empty={EMPTY_CONVERSATIONS}
          render={(conversations) => (
            <>
              {conversations.map(conversation => (
                <Link 
                  key={conversation.id}
                  href={ROUTES.CONVERSATION(projectId, toolSlug, conversation.id)}
                  className={`block p-3 hover:bg-gray-100 ${
                    conversation.id === activeConversationId ? 'bg-blue-50' : ''
                  }`}
                >
                  <p className="text-sm truncate">{conversation.title}</p>
                </Link>
              ))}
            </>
          )}
        />
      </div>
    </div>
  );
}