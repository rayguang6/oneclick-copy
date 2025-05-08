'use client'
import React, { createContext, useContext, useState, useRef } from 'react';

// Define context type
type ConversationContextType = {
  // States
  isGenerating: boolean;
  streamingContent: string;
  streamingConversationId: string | null;
  
  // Actions
  generateContent: (prompt: string, systemPrompt: string) => Promise<void>;
};

// Create the context
const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

// Provider props
interface ConversationProviderProps {
  children: React.ReactNode;
  projectContext?: any;
}

export const ConversationProvider = ({
  children,
  projectContext = {},
}: ConversationProviderProps) => {
  // Essential state
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingConversationId, setStreamingConversationId] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Generate function
  const generateContent = async (prompt: string, systemPrompt: string): Promise<void> => {
    if (isGenerating || !prompt.trim()) return;
    
    console.log('Generating content with:');
    console.log('- Prompt:', prompt);
    console.log('- System Prompt:', systemPrompt);
    console.log('- Project Context:', projectContext);
    
    // Set generating state
    setIsGenerating(true);
    setStreamingContent(''); // Reset streaming content
    
    // Create a temporary conversation ID
    const tempConversationId = crypto.randomUUID();
    setStreamingConversationId(tempConversationId);
    
    // Create abort controller
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    try {
      // Call streaming API
      const response = await fetch('/api/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemPrompt,
          projectContext,
          stream: true,
        }),
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      console.log('Response started:', response.status);
      
      // Handle streaming response
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        let accumulatedResponse = '';
        let done = false;
        
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          
          if (value) {
            const text = decoder.decode(value);
            
            const lines = text.split('\n\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.substring(6));
                  if (data.content) {
                    accumulatedResponse += data.content;
                    
                    // Format the content simply
                    let formattedContent = accumulatedResponse
                      .replace(/\n\n/g, '</p><p>')
                      .replace(/\n/g, '<br>');
                    
                    if (!formattedContent.startsWith('<')) {
                      formattedContent = '<p>' + formattedContent;
                    }
                    if (!formattedContent.endsWith('>')) {
                      formattedContent = formattedContent + '</p>';
                    }
                    
                    setStreamingContent(formattedContent);
                  }
                } catch (e) {
                  // Ignore parse errors from incomplete JSON
                }
              }
            }
          }
        }
        
        console.log('Streaming completed');
        
        // TODO: Save to database once streaming is complete
        // For now, we'll just keep the stream content available
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
        return;
      }
      
      // Set error message
      setStreamingContent(`<p>Error: ${error.message || 'Failed to generate content'}</p>`);
    } finally {
      setIsGenerating(false);
      // Note: We don't reset streamingContent or streamingConversationId so that ContentPanel can still render it
    }
  };

  // Provide context value
  const contextValue: ConversationContextType = {
    isGenerating,
    streamingContent,
    streamingConversationId,
    generateContent,
  };

  return (
    <ConversationContext.Provider value={contextValue}>
      {children}
    </ConversationContext.Provider>
  );
};

// Custom hook to use the conversation context
export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
};