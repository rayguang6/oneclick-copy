'use client'

import { useState, useRef, useEffect } from 'react'
import { CREDIT_COST } from '@/constants/constant'
import CreditIcon from '@/app/components/ui/CreditIcon' // Import the shared icon component

export default function PromptInput({ 
  prompt,
  setPrompt,
  onSubmit,
  isGenerating = false, // Added isGenerating prop
}: { 
  prompt: string,
  setPrompt: (value: string) => void,
  onSubmit: () => void,
  isGenerating?: boolean, // Make it optional for backward compatibility
}) {
  const [isMac, setIsMac] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Detect OS of user computer
  useEffect(() => {
    // Check if the user is on a Mac
    const userAgent = navigator.userAgent.toLowerCase()
    setIsMac(userAgent.indexOf('mac') !== -1)
  }, [])

  const submit = () => {
    if (prompt.trim() && !isGenerating) {
      onSubmit();
      // Don't clear the prompt here, let the parent component handle it
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className={`relative`}>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isGenerating}
          placeholder={"Describe the content you want to generate..."}
          className={`w-full text-sm border rounded-lg px-4 py-3 resize-none min-h-[80px] max-h-[200px] overflow-y-auto
            placeholder:text-gray-400 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all
            ${isGenerating ? 'bg-gray-50' : 'bg-white'}
            `}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {prompt.length > 0 && (
            <span>{prompt.length} characters</span>
          )}
        </div>
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={submit}
            disabled={!prompt.trim() || isGenerating}
            className={`px-4 py-2 rounded-md text-white text-sm font-medium flex items-center transition-colors
              ${isGenerating || !prompt.trim()
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow'}`}
            title={`Generate content (${isMac ? '⌘' : 'Ctrl'}+Enter)`}
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-l-transparent rounded-full mr-1"></span>
                <span className="font-medium">GENERATING...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-medium">GENERATE</span>
                <div className="flex justify-center items-center gap-1 rounded px-1.5 py-0.5 text-xs">
                  <CreditIcon />
                  <p className='font-bold'>{CREDIT_COST}</p>
                </div>
                <div className="flex justify-center items-center gap-1 bg-white/20 rounded px-1.5 py-0.5 text-xs">
                  <span>{isMac ? '⌘' : 'Ctrl'}+Enter</span>
                </div>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}