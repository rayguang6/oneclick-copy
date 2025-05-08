'use client'

import { useState, useEffect } from 'react'

interface FrameworkWelcomeProps {
  frameworks: Framework[]
  selectedFramework: string
  onSelectFramework: (framework: string) => void
  projectContext: Project | null
  toolConfig: Tool | null
  onGenerate: (prompt: string) => Promise<void>
  isGenerating: boolean
}

export default function FrameworkWelcome({
  frameworks,
  selectedFramework,
  onSelectFramework,
  projectContext,
  toolConfig,
  onGenerate,
  isGenerating
}: FrameworkWelcomeProps) {
  const [pendingFramework, setPendingFramework] = useState<string | null>(null)
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null)

  const getDefaultPrompt = (framework: string): string => {
    return `Generate content using the ${framework} framework for ${projectContext?.name || 'my project'}.`
  }

  const handleFrameworkClick = (framework: string) => {
    if (isGenerating) return
    setPendingFramework(framework)
    setPendingPrompt(getDefaultPrompt(framework))
    onSelectFramework(framework)
  }

  useEffect(() => {
    if (
      pendingFramework &&
      selectedFramework === pendingFramework &&
      pendingPrompt
    ) {
      onGenerate(pendingPrompt)
      setPendingFramework(null)
      setPendingPrompt(null)
    }
  }, [selectedFramework, pendingFramework, pendingPrompt, onGenerate])

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 overflow-y-auto">
      <div className="text-center max-w-3xl w-full">
        <div className="text-5xl mb-6">{toolConfig?.icon || '🔧'}</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">{toolConfig?.title}</h1>
        <p className="text-lg text-gray-600 mb-8">{toolConfig?.description || 'Click on any framework below to generate content.'}</p>
        
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Choose a Framework to Generate Content</h2>
        
        {/* Framework Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {frameworks.map((fw) => (
            <button
              key={fw.name}
              onClick={() => handleFrameworkClick(fw.name)}
              disabled={isGenerating}
              className={`p-5 rounded-lg border transition-all hover:shadow-md flex flex-col items-center text-left ${
                isGenerating 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:border-blue-300'
              } ${
                selectedFramework === fw.name && isGenerating
                  ? 'bg-blue-50 border-blue-300 shadow-sm' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3 overflow-hidden">

                  <img 
                    src={fw.image ? fw.image : IMAGE_PATH.framework_default} 
                    alt={fw.name} 
                    className="w-full h-full object-cover"
                  />
            
              </div>
              <h3 className="font-medium text-gray-800 mb-1">{fw.name}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                {fw.description || `Generate content using the ${fw.name} framework.`}
              </p>
              
              {/* Show loading indicator if this framework is being generated */}
              {isGenerating && selectedFramework === fw.name && (
                <div className="flex items-center justify-center gap-2 mt-2 text-blue-600 text-xs font-medium">
                  <span className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                  <span>Generating...</span>
                </div>
              )}
              
              {/* Show a call to action if not loading */}
              {(!isGenerating || selectedFramework !== fw.name) && (
                <div className="mt-2 text-blue-600 text-xs font-medium flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  <span>Click to generate</span>
                </div>
              )}
            </button>
          ))}
        </div>
        
        <div className="text-gray-500 text-sm mt-8">
          <p>
            {isGenerating ? 
              "Generating content... This may take a few moments." : 
              "Click on any framework to instantly generate content, or enter your own prompt in the sidebar."}
          </p>
        </div>
      </div>
    </div>
  )
}