// components/conversation/MessageList.tsx
import React from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="mb-2">No messages yet</p>
            <p className="text-sm">Type a message below to get started</p>
          </div>
        </div>
      ) : (
        messages.map(message => (
          <div 
            key={message.id}
            className={`p-3 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-50 ml-12' 
                : 'bg-gray-50 mr-12'
            }`}
          >
            <p>{message.content}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(message.createdAt).toLocaleTimeString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}