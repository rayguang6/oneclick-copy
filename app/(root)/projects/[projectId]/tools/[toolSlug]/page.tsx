// app/(root)/projects/[projectId]/tools/[toolSlug]/page.tsx
import ContentPanelWrapper from '@/app/components/conversation/ContentPanelWrapper'
import { getTool } from '@/lib/actions/tools.actions'
import { getFrameworks } from '@/lib/actions/frameworks.actions'

type RouteParams = {
  params: {
    projectId: string;
    toolSlug: string;
  };
};

export default async function ToolPage({ params }: RouteParams) {
  const { projectId, toolSlug } = params;
  
  // Get tool config
  const { data: toolData } = await getTool({ slug: toolSlug });
  const { data: frameworksData } = await getFrameworks({ toolSlug });
  
  // Extract tool config and framework
  const toolConfig = toolData?.tool || { id: toolSlug, title: toolSlug, icon: '🛠️' };
  const frameworks = frameworksData?.frameworks || [];
  const defaultFramework = frameworks.find(f => f.is_default)?.name 
    || frameworks[0]?.name
    || 'default';
  
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Use our wrapper around ContentPanel */}
      <ContentPanelWrapper 
        toolConfig={toolConfig}
        framework={defaultFramework}
      />
    </div>
  );
}