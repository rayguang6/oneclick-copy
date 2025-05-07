import ProjectDetailsSection from '@/app/components/projects/ProjectDetailsSection';
import { ROUTES } from '@/constants/routes';
import { getProject } from '@/lib/actions/project.actions';
import Link from 'next/link';
import React from 'react';

type RouteParams = {
  params: { id: string };
  searchParams: { page?: string; pageSize?: string; filter?: string };
};

const ProjectDetails = async ({ params, searchParams }: RouteParams) => {
  const { id } = params;
  const { success, data: project } = await getProject({ projectId: id });

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

  return (
    <div className="mx-auto p-6">
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
      
    </div>
  );
};

// Helper component for consistent detail items
const DetailItem = ({ label, value }: { label: string; value: string | null | undefined }) => {
  if (!value) return null;
  
  return (
    <div className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
      <h2 className="text-sm font-semibold text-gray-600 mb-1">{label}</h2>
      <p className="text-gray-800 whitespace-pre-line">{value}</p>
    </div>
  );
};

export default ProjectDetails;