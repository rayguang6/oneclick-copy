// app/components/projects/ProjectDetailsSection.tsx
'use client'

import { useState } from 'react'
import Modal from '@/app/components/ui/Modal'
// import { updateProject, deleteProject } from '@/app/lib/actions/project.actions'
import { useRouter } from 'next/navigation'
import ProjectForm from './ProjectForm'

type Props = {
  project: Project
}

export default function ProjectDetailsSection({ project }: Props) {
  const router = useRouter()
  const [currentProject, setCurrentProject] = useState<Project>(project)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Save project details to the database
  const saveProject = async (formData: ProjectFormData) => {
    // setIsSaving(true)
    // setError(null)
    
    // try {
    //   const updatedProject = await updateProject(projectId, formData)
    //   setCurrentProject(updatedProject)
    //   setShowDetails(false) // Hide details after saving
    // } catch (err: any) {
    //   console.error('Error saving project:', err)
    //   setError(err.message || 'Failed to save project details')
    // } finally {
    //   setIsSaving(false)
    // }
    alert('Clicked save project')
  }

  // Handle project deletion
//   const handleDeleteProject = async () => {
//     setIsDeleting(true)
//     setError(null)
    
//     try {
//       await deleteProject(projectId)
//       // Redirect to dashboard after successful deletion
//       router.push('/')
//     } catch (err: any) {
//       console.error('Error deleting project:', err)
//       setError(err.message || 'Failed to delete project')
//       setIsDeleting(false)
//       setShowDeleteConfirm(false)
//     }
//   }

  // Extract form data from project


  return (
    <>
      {/* Project Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-12 w-12 rounded-md flex items-center justify-center text-white text-xl font-bold shadow-md">
            {project.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{currentProject.name}</h1>
            <p className="text-sm text-gray-600">{currentProject.industry}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2 text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            {showDetails ? 'Hide Details' : 'Edit Project Details'}
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded-md bg-red-50 border border-red-300 text-red-700 hover:bg-red-100 shadow-sm flex items-center gap-2 text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Delete Project
          </button>
        </div>
      </div>

      {/* Error message if present */}
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Project Details Form (Collapsible) */}
      {showDetails && (
        <div className="mb-8 bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-blue-500">🎯</span> Edit Project Details
            </h2>
          </div>
          <ProjectForm
            initialData={project}
            onSubmit={saveProject}
            isSubmitting={isSaving}
            submitButtonText="Save Project"
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Project"
        size="md"
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-6 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            Are you sure you want to delete this project?
          </h3>
          
          <p className="text-sm text-gray-600 text-center mb-6">
            This action cannot be undone. All project data, including generated content and history, will be permanently removed.
          </p>
          
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
            //   onClick={handleDeleteProject}
              className={`px-4 py-2 rounded-md text-white ${isDeleting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} flex items-center gap-2`}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Delete Project
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}