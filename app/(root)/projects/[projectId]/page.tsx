import DataRenderer from '@/app/components/DataRenderer';
import ProjectCard from '@/app/components/projects/ProjectCard';
import ProjectDetailsSection from '@/app/components/projects/ProjectDetailsSection';
import ToolCard from '@/app/components/tools/ToolCard';
import { ROUTES } from '@/constants/routes';
import { EMPTY_PROJECTS, EMPTY_TOOLS } from '@/constants/states';
import { getProject } from '@/lib/actions/projects.actions';
import { getTools } from '@/lib/actions/tools.actions';
import Link from 'next/link';
import React from 'react';

type RouteParams = {
  params: { projectId: string };
  searchParams: { page?: string; pageSize?: string; filter?: string };
};

const ProjectDetails = async ({ params, searchParams }: RouteParams) => {
  const { projectId } = await params;
  const { success, data: project } = await getProject({ projectId });

  if (!project) return <div className="p-8 text-center">Project not found</div>;
  
  const { 
    name, 
    industry, 
    guru_details, 
    audience, 
    painpoints, 
    product, 
    usp, 
    competitor, 
    student_transformation, 
    case_study 
  } = project;

  const { success: successGetTools, data: toolsData, error: errorGetTools } = await getTools({  
    // page: Number(page) || 1,
    // pageSize: Number(pageSize) || 10,
    // query,
    // filter,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header with back button */}
      <div className="mb-8">
        <Link 
          href={ROUTES.HOME} 
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to Projects
        </Link>
        {/* <h1 className="text-3xl font-bold mt-2">{name}</h1> */}
      </div>
      
      {/* Project details card */}
      <ProjectDetailsSection project={project} /> 

      {/* Tools Section */}

      <div className="my-8">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
        <span className="text-blue-500">🛠</span> AI Tools
        <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Click to generate content</span>
      </h2>
      
        
      <DataRenderer
          success={successGetTools}
          error={errorGetTools}
          data={toolsData?.tools}
        empty={EMPTY_TOOLS}
        render={(tools) => (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} projectId={projectId} />
            ))}
          </div>
          </>
        )}
      />
      </div>
    </div>

      

    
  );
};


export default ProjectDetails;