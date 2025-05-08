// app/(root)/projects/[projectId]/tools/[toolSlug]/layout.tsx
import React from 'react';
import ConversationSidebar from '@/app/components/conversation/ConversationSidebar';
import { ConversationProvider } from '@/app/context/ConversationProvider';
import { getConversations } from '@/lib/actions/conversations.actions';
import { getFrameworks } from '@/lib/actions/frameworks.actions';
import { getProject } from '@/lib/actions/projects.actions';

interface LayoutProps {
  children: React.ReactNode;
  params: { projectId: string; toolSlug: string };
}

export default async function ToolLayout({ children, params }: LayoutProps) {
  const { projectId, toolSlug } = await params;

  // Fetch all data first
  const projectResult = await getProject({ projectId });
  const conversationsResult = await getConversations({ projectId, toolSlug });
  const frameworksResult = await getFrameworks({ toolSlug });
  
  // Extract the data or use default empty values
  const conversations = conversationsResult.data?.conversations || [];
  const frameworks = frameworksResult.data?.framework || [];
  
  // Create a hardcoded project context for testing if the real one is empty
  // This ensures we at least have something to work with
  let projectContext = {
    id: projectId,
    name: "Test Project",
    description: "This is a test project for LLM context"
  };
  
  // Check if we got actual project data and use it if available
  if (projectResult.success && projectResult.data) {
    console.log("Project data received:", projectResult.data);
    projectContext = projectResult.data;
  } else {
    console.warn("No project data found, using default context:", projectContext);
  }
  
  return (
    <ConversationProvider projectContext={projectContext}>
      <div className="flex overflow-hidden h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <ConversationSidebar frameworks={frameworks} conversations={conversations} projectId={projectId} toolSlug={toolSlug} />
        
        {/* Main content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {children}
        </div>
      </div>
    </ConversationProvider>
  );
}