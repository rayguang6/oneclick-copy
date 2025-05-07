import React from 'react'
import Link from 'next/link'
import { ROUTES } from '@/constants/routes'

interface ToolCardProps {
  tool: Tool;
  projectId: string;
}

const ToolCard = ({ tool, projectId }: ToolCardProps) => {
    return (
        <Link
            key={tool.id}
        href={`${ROUTES.TOOL(projectId, tool.slug)}`}
            className="group bg-white border rounded-xl p-6 hover:shadow-lg transition-all hover:border-blue-200 flex flex-col h-full relative overflow-hidden"
        >
            {/* Tool Icon */}
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <span className="text-2xl">{tool.icon || '🔧'}</span>
            </div>

            {/* Tool Content */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{tool.title}</h3>
            <p className="text-sm text-gray-600 mb-4 flex-grow">
                {tool.description}
            </p>

            {/* Hover Indicator */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </Link>
    )
}

export default ToolCard