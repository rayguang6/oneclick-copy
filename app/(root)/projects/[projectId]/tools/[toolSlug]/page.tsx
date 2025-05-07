// app/(root)/projects/[projectId]/tools/[toolSlug]/page.tsx
import React from 'react';

type PageProps = {
  params: {
    projectId: string;
    toolSlug: string;
  };
};

export default function ToolLandingPage({ params }: PageProps) {
  const { projectId, toolSlug } = params;
  
  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to the Chat Tool</h2>
        <p className="text-gray-600 mb-6">
          Select an existing conversation from the sidebar or create a new one to get started.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-200">
          <p>Project ID: {projectId}</p>
          <p>Tool: {toolSlug}</p>
        </div>
      </div>
    </div>
  );
}