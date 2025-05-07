import React from 'react'
import ConversationSidebar from '@/app/components/conversation/ConversationSidebar'

interface LayoutProps {
    children: React.ReactNode;
    params: { projectId: string; toolSlug: string };
  }

const layout = ({ children, params }: LayoutProps) => {
  return (
    <div className="flex flex-1 bg-white text-gray-800">
        <ConversationSidebar projectId={params.projectId} toolSlug={params.toolSlug} />
        <div className="flex-1 overflow-auto">
            {children}
        </div>
    </div>
  )
}

export default layout