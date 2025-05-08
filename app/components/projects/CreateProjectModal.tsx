'use client'

import { useState } from 'react'
import Modal from '@/app/components/ui/Modal'
import ProjectForm from './ProjectForm'
import { createProject } from '@/lib/actions/projects.actions'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants/routes'

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateProject = async (projectData: Project) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      // We omit fields that should be handled by the database
      const { id, user_id, created_at, updated_at, ...formData } = projectData
      
      // Call the server action to create the project
      const newProject = await createProject(formData)
      
      // Close the modal
      onClose()
      
      // Redirect to the new project page
      router.push(ROUTES.PROJECT(newProject.id))
    } catch (err: any) {
      console.error('Failed to create project:', err)
      setError(err.message || 'Failed to create project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project" size="xl">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="max-h-[80vh] overflow-hidden">
        <ProjectForm
          onSubmit={handleCreateProject}
          isSubmitting={isSubmitting}
          submitButtonText="Create Project"
          onCancel={onClose}
        />
      </div>
    </Modal>
  )
} 