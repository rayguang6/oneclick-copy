import { ROUTES } from '@/app/constants/routes';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import React from 'react'

interface Props {
  project: Project; 
}

const ProjectCard = ({ 
    project: { id, name, industry, created_at },
 }: Props) => {
  return (
    <Link 
    href={ROUTES.PROJECT(id)}
    className="block"
  >
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Banner with project name */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 h-24 flex items-center justify-center">
        <h3 className="font-bold text-white text-center text-xl line-clamp-2 px-2">
          {name}
        </h3>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
            {industry || 'Project'}
          </span>
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
            Active
          </span>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Created {formatDate(created_at)}
        </div>
      </div>
    </div>
  </Link>
  )
}

export default ProjectCard