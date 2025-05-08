'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import PromptInput from './PromptInput';
import FrameworkSelectorDropdown from './FrameworkSelector';
import { useConversation } from '@/app/context/ConversationProvider';

type ConversationSidebarProps = {
  conversations: Conversation[];
  frameworks: Framework[];
  projectId: string;
  toolSlug: string;
};

const ConversationSidebar = ({ conversations, frameworks, projectId, toolSlug }: ConversationSidebarProps) => {
  // Use the conversation context
  const { isGenerating, generateContent } = useConversation();

  const [selectedFramework, setSelectedFramework] = useState(
    frameworks.find(f => f.is_default)?.name || frameworks[0]?.name || ''
  );
  
  // State for prompt input
  const [prompt, setPrompt] = useState('');

  // Handler for submitting the message
  const handleGenerate = async (): Promise<void> => {
    if (!prompt.trim() || isGenerating) return;

    try {
      // Find the corresponding framework object to get system prompt
      const frameworkObj = frameworks.find(f => f.name === selectedFramework);
      const systemPrompt = frameworkObj?.system_prompt || "You are a helpful assistant.";

      console.log('=============== GENERATION DATA ===============');
      console.log('Using framework:', selectedFramework);
      console.log('With system prompt:', systemPrompt);
      console.log('User prompt:', prompt);
      console.log('==============================================');
      
      // Use the generateContent function from the context
      await generateContent(prompt, systemPrompt);
      
      // Clear the prompt after successful response
      setPrompt('');
      
    } catch (err) {
      console.error('Generation failed', err);
    }
  };

  return (
    <div className={`w-full max-w-xs lg:max-w-sm border-r border-gray-200 flex flex-col bg-white z-10 lg:relative`}>
        <div className="p-5 border-b border-gray-200 space-y-5">
          <div className="flex items-center justify-between">
            <Link 
              href={ROUTES.PROJECT(projectId)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>Back to project</span>
            </Link>
          </div>

          <div className="flex flex-row items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                {/* Tool info would go here */}
              </h2>
            </div>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              New
            </button>
          </div>

          <div className="relative w-full">
            <FrameworkSelectorDropdown
              selected={selectedFramework}
              onSelect={setSelectedFramework}
              dbFrameworks={frameworks}
            />
          </div>

          <PromptInput 
            prompt={prompt}
            setPrompt={setPrompt}
            onSubmit={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>

        {/* History Lists - Now showing both conversations and legacy chats */}
        <div className="flex-1 p-5 overflow-y-auto">
          {/* Show conversations if available */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 mb-3">CONVERSATIONS</h3>
            <div className="flex flex-col">
              {conversations.map((conversation) => (
                <Link 
                  key={conversation.id}
                  className="mt-2" 
                  href={ROUTES.CONVERSATION(projectId, toolSlug, conversation.id)}
                >
                  <div
                    className={`p-3 rounded-md flex items-center cursor-pointer border transition-all
                      bg-gray-100 border-gray-200 hover:bg-gray-50`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xs w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {conversation.title}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {/* {new Date(conversation.updated_at).toLocaleString()} */}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default ConversationSidebar;