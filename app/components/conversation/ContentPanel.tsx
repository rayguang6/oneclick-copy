'use client'

import { useState, useEffect } from 'react'

interface ContentPanelProps {
  toolConfig: Tool
  framework: string
  isGenerating: boolean
  sidebarOpen: boolean
  streamingContent?: string
  streamingConversationId?: string | null
  activeConversationId?: string | null
  conversationChats: Chat[]
  onToggleFavorite?: (chatId: string) => Promise<void>
}

const ContentPanel: React.FC<ContentPanelProps> = ({
  toolConfig,
  framework,
  isGenerating,
  sidebarOpen,
  streamingContent = '',
  streamingConversationId = null,
  activeConversationId = null,
  conversationChats = [],
  onToggleFavorite
}) => {
  // State for copied chat ID
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  // Log chat content when it changes
  useEffect(() => {
    if (conversationChats.length > 0) {

    }
  }, [conversationChats]);
  
  // Function to check if content is HTML
  const isHtmlContent = (content: string) => {
    const htmlRegex = /<\/?[a-z][\s\S]*>/i;
    return htmlRegex.test(content);
  }
  
  // Function to sanitize HTML for copying
  const sanitizeHtmlForCopy = (htmlContent: string) => {
    return htmlContent
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '\n\n')
      .replace(/<br>/g, '\n')
      .replace(/<strong>(.*?)<\/strong>/g, '$1')
      .replace(/<h1>(.*?)<\/h1>/g, '$1\n')
      .replace(/<h2>(.*?)<\/h2>/g, '$1\n')
      .replace(/<h3>(.*?)<\/h3>/g, '$1\n')
      .replace(/<ul>|<\/ul>/g, '')
      .replace(/<li>(.*?)<\/li>/g, '• $1\n')
      .replace(/<em>(.*?)<\/em>/g, '$1')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+\n/g, '\n')
      .replace(/\n\s+/g, '\n')
      .trim();
  }
  
  // Function to enhance HTML styling with more subdued colors and tighter spacing
  const enhanceHtmlStyling = (htmlContent: string) => {
    return htmlContent
      // Remove unwanted $2 codes (specific to your LLM output issue)
      .replace(/<p>\s*\$2\s*<\/p>/g, '')
      .replace(/^\s*\$2\s*$/gm, '')
      .replace(/\$2/g, '')
      
      // Reduce number of <br> tags
      .replace(/<br>\s*<br>\s*<br>/g, '<br><br>')
      .replace(/<br>\s*<br>/g, '<br>')
      .replace(/---/g, '<hr class="my-3 border-gray-200">')
      
      // Style headings with black text and tighter spacing
      .replace(/<h1>(.*?)<\/h1>/g, '<h1 class="text-2xl font-bold mt-3 mb-2 text-gray-900">$1</h1>')
      .replace(/<h2>(.*?)<\/h2>/g, '<h2 class="text-xl font-bold mt-2 mb-1 text-gray-900">$1</h2>')
      .replace(/<h3>(.*?)<\/h3>/g, '<h3 class="text-lg font-bold mt-1 mb-1 text-gray-900">$1</h3>')
      
      // Style paragraphs with minimal spacing
      .replace(/<p(?!\s+class)(.*?)>(.*?)<\/p>/g, '<p class="mb-2 text-gray-800"$1>$2</p>')
      
      // Style lists with tighter spacing
      .replace(/<ul(?!\s+class)(.*?)>/g, '<ul class="mb-2 ml-5 list-disc"$1>')
      .replace(/<ol(?!\s+class)(.*?)>/g, '<ol class="mb-2 ml-5 list-decimal"$1>')
      .replace(/<li(?!\s+class)(.*?)>/g, '<li class="mb-1"$1>')
      
      // Style inline elements
      .replace(/<strong(?!\s+class)(.*?)>(.*?)<\/strong>/g, '<strong class="font-semibold text-gray-900"$1>$2</strong>')
      .replace(/<em(?!\s+class)(.*?)>(.*?)<\/em>/g, '<em class="italic text-gray-800"$1>$2</em>');
  }
  
  // Pre-process the content for display and fix common issues
  const preProcessContent = (content: string) => {
    // First remove any "$2" markers that might be present
    let processed = content.replace(/\$2/g, '');
    
    // Remove excessive line breaks and spacing
    processed = processed.replace(/(<br\s*\/?>){2,}/gi, '<br>');
    processed = processed.replace(/---/g, '<hr class="my-2 border-gray-200">');
    
    return processed;
  }
  
  // Copy content to clipboard with smart sanitization
  const copyToClipboard = (text: string, chatId: string) => {
    let contentToCopy = text;
    
    // Check if it's HTML content and sanitize if needed
    if (isHtmlContent(text)) {
      contentToCopy = sanitizeHtmlForCopy(text);
    }
    
    // Remove "$2" codes from the copied text
    contentToCopy = contentToCopy.replace(/\$2/g, '');
    
    navigator.clipboard.writeText(contentToCopy)
    setCopiedId(chatId)
    setTimeout(() => setCopiedId(null), 2000)
  }
  
  // Handler for favorite toggle
  const handleToggleFavorite = async (chatId: string) => {
    if (onToggleFavorite) {
      try {
        await onToggleFavorite(chatId)
      } catch (error) {
        console.error('Error toggling favorite status:', error)
      }
    }
  }

  // Filter chats to show only AI/system responses
  const aiChats = conversationChats.filter(chat => chat.role === 'system')
  
  // Only show streaming content for the active conversation
  const shouldShowStreamingContent = streamingConversationId === activeConversationId && streamingContent
  
  // Don't show separate loading placeholder if we already have system chats that will be updated
  const shouldShowLoadingPlaceholder = isGenerating && 
    streamingConversationId === activeConversationId && 
    !streamingContent && 
    !(aiChats.some(chat => chat.content === ''))
    
  // Helper function to detect if content is markdown
  const isMarkdownContent = (content: string) => {
    return content.trim().startsWith('```markdown') || 
           content.trim().startsWith('`markdown') || 
           content.trim().startsWith('markdown');
  }
  
  // Helper function to clean markdown content
  const cleanMarkdownContent = (content: string) => {
    let cleaned = content;
    if (content.trim().startsWith('```markdown')) {
      cleaned = content.replace(/```markdown/, '').replace(/```$/, '');
    } else if (content.trim().startsWith('`markdown')) {
      cleaned = content.replace(/`markdown/, '').replace(/`$/, '');
    } else if (content.trim().startsWith('markdown')) {
      cleaned = content.replace(/^markdown/, '');
    }
    return cleaned.trim();
  }

  return (
    <div className={`flex-1 w-full h-full overflow-y-auto bg-gray-50 relative ${sidebarOpen ? 'ml-0' : '-ml-full'} transition-all duration-300`}>
      {/* Header */}
      <div className="py-3 px-4 border-b bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{toolConfig.icon || '🤖'}</span>
          <div>
            <h1 className="font-medium text-gray-900">{toolConfig.title}</h1>
            <p className="text-xs text-gray-500">Using {framework} framework</p>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="py-5 overflow-y-auto">
        {/* Render conversation chats - only AI responses */}
        <div className="space-y-3 max-w-4xl mx-auto px-4">
          {aiChats.map(chat => (
            <div 
              key={chat.id} 
              className="p-4 rounded-lg shadow-sm transition-opacity bg-white border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full mr-2 bg-gray-100 text-gray-700">
                    AI
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    Generated Content
                  </span>
                  {/* Show loading indicator next to title if this chat is being updated */}
                  {isGenerating && chat.content === '' && (
                    <div className="flex space-x-1 ml-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {/* Copy button */}
                  <button
                    onClick={() => copyToClipboard(chat.content, chat.id)}
                    className={`p-1.5 rounded transition-colors ${
                      copiedId === chat.id
                        ? 'text-green-500 bg-green-50'
                        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                    title="Copy to clipboard"
                  >
                    {copiedId === chat.id ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    )}
                  </button>
                  
                  {/* Favorite button */}
                  <button 
                    onClick={() => handleToggleFavorite(chat.id)}
                    className={`p-1 rounded ${chat.is_favorite ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={chat.is_favorite ? 'currentColor' : 'none'} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </button>
                  
                  {/* Timestamp */}
                  <span className="text-xs text-gray-500">
                    {new Date(chat.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              
              {/* Content display */}
              {(shouldShowStreamingContent && chat.content === '') ? (
                <div className="prose max-w-none">
                  {isMarkdownContent(streamingContent) ? (
                    <div className="markdown-content" dangerouslySetInnerHTML={{ 
                      __html: cleanMarkdownContent(streamingContent)
                        .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold mb-2 text-gray-900">$1</h1>')
                        .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold mb-1 text-gray-900">$1</h2>')
                        .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold mb-1 text-gray-900">$1</h3>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>')
                        .replace(/^- (.*?)$/gm, '<ul class="list-disc pl-4 mb-2"><li class="mb-0.5">$1</li></ul>')
                        .replace(/\n\n/g, '</p><p class="mb-2 text-gray-800">')
                        .replace(/\n/g, '<br>')
                        .replace(/\$2/g, '') // Remove "$2" markers
                        .replace(/<br>\s*<br>/g, '<br>') // Remove doubled line breaks
                    }} />
                  ) : isHtmlContent(streamingContent) ? (
                    <div className="html-content" dangerouslySetInnerHTML={{ 
                      __html: enhanceHtmlStyling(preProcessContent(streamingContent)) 
                    }} />
                  ) : (
                    <div className="plain-text">
                      <p className="mb-2 text-gray-800" dangerouslySetInnerHTML={{ 
                        __html: preProcessContent(streamingContent).replace(/\n/g, '<br>') 
                      }} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="prose max-w-none">
                  {isMarkdownContent(chat.content) ? (
                    <div className="markdown-content" dangerouslySetInnerHTML={{ 
                      __html: cleanMarkdownContent(chat.content)
                        .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold mb-2 text-gray-900">$1</h1>')
                        .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold mb-1 text-gray-900">$1</h2>')
                        .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold mb-1 text-gray-900">$1</h3>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>')
                        .replace(/^- (.*?)$/gm, '<ul class="list-disc pl-4 mb-2"><li class="mb-0.5">$1</li></ul>')
                        .replace(/\n\n/g, '</p><p class="mb-2 text-gray-800">')
                        .replace(/\n/g, '<br>')
                        .replace(/\$2/g, '') // Remove "$2" markers
                        .replace(/<br>\s*<br>/g, '<br>') // Remove doubled line breaks
                    }} />
                  ) : isHtmlContent(chat.content) ? (
                    <div className="html-content" dangerouslySetInnerHTML={{ 
                      __html: enhanceHtmlStyling(preProcessContent(chat.content)) 
                    }} />
                  ) : (
                    <div className="plain-text">
                      <p className="mb-2 text-gray-800" dangerouslySetInnerHTML={{ 
                        __html: preProcessContent(chat.content).replace(/\n/g, '<br>') 
                      }} />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {/* Loading placeholder */}
          {shouldShowLoadingPlaceholder && (
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm animate-fadeIn">
              <div className="flex items-center mb-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full mr-2 bg-gray-100 text-gray-700">
                  AI
                </span>
                <span className="text-sm font-medium text-gray-700">
                  Generated Content
                </span>
                <div className="ml-auto flex items-center">
                  <div className="flex space-x-1 ml-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-500">Preparing content...</p>
              </div>
            </div>
          )}
          
          {/* Empty state */}
          {aiChats.length === 0 && !shouldShowLoadingPlaceholder && (
            <div className="mt-8 mb-6 flex flex-col items-center justify-center text-center">
              <div className="mb-4 w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No content generated yet</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Enter a prompt in the sidebar to generate content.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContentPanel