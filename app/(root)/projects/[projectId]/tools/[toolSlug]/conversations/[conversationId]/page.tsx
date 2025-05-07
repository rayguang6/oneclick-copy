// app/(root)/projects/[projectId]/tools/[toolSlug]/conversations/[conversationId]/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { getChatMessages, sendMessage } from '@/lib/actions/chats.actions';
import DataRenderer from '@/app/components/DataRenderer';

type PageProps = {
  params: {
    projectId: string;
    toolSlug: string;
    conversationId: string;
  };
};

type Message = {
  id: string;
  role: 'user' | 'system';
  content: string;
  created_at: string;
};

export default function ConversationPage({ params }: PageProps) {
  const { projectId, toolSlug, conversationId } = params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch messages
  useEffect(() => {
    async function fetchMessages() {
      try {
        setIsLoading(true);
        const result = await getChatMessages({ conversationId });
        
        if (result.success && result.data) {
          setMessages(result.data.messages);
        } else {
          setError(result.error || 'Failed to fetch messages');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchMessages();
  }, [conversationId]);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Send a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isSending) return;
    
    try {
      setIsSending(true);
      const result = await sendMessage({
        conversationId,
        content: newMessage
      });
      
      if (result.success) {
        // Refresh messages after sending
        const messagesResult = await getChatMessages({ conversationId });
        if (messagesResult.success && messagesResult.data) {
          setMessages(messagesResult.data.messages);
        }
        setNewMessage('');
      } else {
        setError(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Messages section */}
      <div className="flex-1 overflow-y-auto p-4">
        <DataRenderer
          success={!error}
          error={error}
          data={messages}
          loading={isLoading}
          empty="No messages yet. Start the conversation below."
          render={(messages) => (
            <div className="space-y-4">
              {messages.map(message => (
                <div 
                  key={message.id}
                  className={`p-4 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-blue-50 ml-12' 
                      : 'bg-gray-50 mr-12'
                  }`}
                >
                  <div className="font-medium mb-2">
                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                  </div>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: message.content }} />
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        />
      </div>
      
      {/* Message input */}
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}