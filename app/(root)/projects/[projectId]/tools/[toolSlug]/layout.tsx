// app/(root)/projects/[projectId]/tools/[toolSlug]/layout.tsx
import React from 'react';
import ConversationSidebar from '@/app/components/conversation/ConversationSidebar';

interface LayoutProps {
  children: React.ReactNode;
  params: { projectId: string; toolSlug: string };
}

export default function ToolLayout({ children, params }: LayoutProps) {
  const { projectId, toolSlug } = params;

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <ConversationSidebar projectId={projectId} toolSlug={toolSlug} />
      
      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
}