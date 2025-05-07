import React from 'react'

type RouteParams = {
    params: { projectId: string; toolSlug: string };
    searchParams: { page?: string; pageSize?: string; filter?: string };
  };

const ToolDetails = async ({ params, searchParams }: RouteParams) => {
    const { projectId, toolSlug } = await params;
    // const { success, data: project } = await getProject({ projectId }); 
  
    // if (!project) return <div className="p-8 text-center">Project not found</div>;
    return (
        <div>
            <h1>Tool Details</h1>
            <p>Project ID: {projectId}</p>
            <p>Tool Slug: {toolSlug}</p>
        </div>
    )
}

export default ToolDetails