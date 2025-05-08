'use client'
import { useConversation } from '@/app/context/ConversationProvider'

export default function StreamingContent() {
  const { isGenerating, streamingContent } = useConversation();

  if (!isGenerating && !streamingContent) {
    return null;
  }

  return (
    <div className="p-4 rounded-lg mt-4">
      {isGenerating && (
        <div className="flex items-center mb-2 text-blue-600">
          <div className="flex space-x-1 items-center">
            <span>AI is thinking</span>
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse ml-1"></span>
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse ml-1" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse ml-1" style={{ animationDelay: '0.4s' }}></span>
          </div>
        </div>
      )}
      
      {streamingContent && (
        <div 
          className="bg-gray-50 mr-12 p-4 rounded-lg"
        >
          <div className="font-medium mb-2">AI</div>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: streamingContent }}
          />
        </div>
      )}
    </div>
  );
}