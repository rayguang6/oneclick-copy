// components/conversation/ConversationSidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { PlusIcon, ArrowLeftIcon } from 'lucide-react';

interface ConversationSidebarProps {
  projectId: string;
  toolSlug: string;
}

export default function ConversationSidebar({
  projectId,
  toolSlug
}: ConversationSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract conversation ID from pathname if present
  const isConversationPage = pathname.includes('/conversations/');
  const conversationId = isConversationPage 
    ? pathname.split('/').pop() 
    : null;
  
  // Mock conversations
  const [conversations, setConversations] = useState([
    { id: 'conv-1', title: 'First Conversation', updatedAt: '2025-05-01T12:00:00Z' },
    { id: 'conv-2', title: 'Help with React', updatedAt: '2025-05-02T14:30:00Z' },
  ]);
  
  // Function to create a new conversation
  const handleNewConversation = () => {
    const newId = `new-${Date.now()}`;
    router.push(`/projects/${projectId}/tools/${toolSlug}/conversations/${newId}`);
  };
  
  return (
    <div className="w-[280px] h-full flex flex-col border-r border-gray-200 bg-gray-50">
      <div className="p-4 border-b border-gray-200">
        <Link 
          href={`/projects/${projectId}`}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon size={16} className="mr-2" />
          Back to Project
        </Link>
      </div>
      
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-medium">
          {toolSlug === 'chatbot' && 'AI Chatbot'} 
          {toolSlug === 'writer' && 'Content Writer'}
          {toolSlug === 'coder' && 'Code Assistant'}
        </h2>
      </div>
      
      <div className="p-3">
        <button 
          onClick={handleNewConversation}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center gap-2"
        >
          <PlusIcon size={16} />
          New Conversation
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {conversations.map(conversation => (
          <Link
            key={conversation.id}
            href={`/projects/${projectId}/tools/${toolSlug}/conversations/${conversation.id}`}
          >
            <div className={`p-3 cursor-pointer hover:bg-gray-200 ${
              conversation.id === conversationId ? 'bg-gray-200' : ''
            }`}>
              <p className="text-sm font-medium truncate">{conversation.title}</p>
              <p className="text-xs text-gray-500">
                {new Date(conversation.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}