'use client'
import { useEffect, useRef } from 'react'
import { useConversation } from '@/app/context/ConversationProvider'

interface StreamingDisplayProps {
  className?: string;
}

export default function StreamingDisplay({ className = '' }: StreamingDisplayProps) {
  const { isGenerating, streamingContent } = useConversation();
  
  // Ref for scrolling to bottom
  const displayEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when content updates
  useEffect(() => {
    if (displayEndRef.current && streamingContent) {
      displayEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [streamingContent]);

  if (!isGenerating && !streamingContent) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center p-6">
          <h3 className="text-xl font-medium text-gray-700 mb-2">Start a Conversation</h3>
          <p className="text-gray-500">Type a prompt below to generate content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 overflow-y-auto ${className}`}>
      {isGenerating && (
        <div className="flex items-center mb-2 text-blue-600">
          <span className="mr-2">Generating</span>
          <span className="flex space-x-1">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
          </span>
        </div>
      )}
      
      <div 
        className="prose max-w-none bg-gray-50 p-4 rounded-lg shadow-sm"
        dangerouslySetInnerHTML={{ __html: streamingContent }}
      />
      
      {/* Invisible element to scroll to */}
      <div ref={displayEndRef} />
    </div>
  );
}