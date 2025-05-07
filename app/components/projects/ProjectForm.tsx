'use client'

import { useState, useCallback } from 'react'

// Textarea field component with smaller default height
const TextareaField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  description 
}: { 
  label: string
  name: string
  value: string
  onChange: (field: string, value: string) => void
  placeholder?: string
  description?: string
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all min-h-[60px] resize-vertical"
      placeholder={placeholder}
    />
    {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
  </div>
)

type ProjectFormProps = {
  initialData?: Project
  onSubmit: (data: Project) => Promise<void>
  onCancel?: () => void
  isSubmitting: boolean
  submitButtonText?: string
}

export default function ProjectForm({
  initialData: project,
  onSubmit,
  onCancel,
  isSubmitting,
  submitButtonText = 'Create Project'
}: ProjectFormProps) {
  const [formData, setFormData] = useState<Project>(project || {} as Project)

  // Use useCallback to prevent unnecessary function recreations
  const handleChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[80vh]">
      {/* Fixed header with shadow when scrolling */}
      <div className="sticky top-0 bg-white z-10 p-6 pt-0 pb-3 mb-4 border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
              placeholder="My Amazing Project"
            />
            <p className="mt-1 text-xs text-gray-500">A clear name to identify your project</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
              placeholder="e.g. Health & Fitness, Finance, E-commerce"
            />
          </div>
        </div>
      </div>
      
      {/* Scrollable content area with bottom padding for footer */}
      <div className="flex-1 overflow-y-auto px-6 pb-24">
        {/* All form fields shown by default with smaller textareas */}
        <TextareaField
          label="Target Audience"
          name="audience"
          value={formData.audience}
          onChange={handleChange}
          placeholder="Describe your ideal customers - their demographics, behaviors, needs, and pain points"
          description="Who is your content targeted towards? Be as specific as possible."
        />

        <TextareaField
          label="Pain Points"
          name="painpoints"
          value={formData.painpoints}
          onChange={handleChange}
          placeholder="What problems, challenges, or frustrations does your audience face that your product/service addresses?"
        />

        <TextareaField
          label="Product/Service"
          name="product"
          value={formData.product}
          onChange={handleChange}
          placeholder="Describe your product or service in detail - features, benefits, delivery method, pricing, etc."
        />

        <TextareaField
          label="Unique Selling Proposition"
          name="usp"
          value={formData.usp}
          onChange={handleChange}
          placeholder="What makes your offer unique compared to competitors? Why should customers choose you?"
        />

        <TextareaField
          label="Competitors"
          name="competitor"
          value={formData.competitor}
          onChange={handleChange}
          placeholder="Who are your main competitors? What are their strengths and weaknesses compared to your offering?"
        />

        <TextareaField
          label="Customer Transformation"
          name="student_transformation"
          value={formData.student_transformation}
          onChange={handleChange}
          placeholder="What transformation or results do customers achieve after using your product/service? How does their life/business improve?"
        />

        <TextareaField
          label="Guru/Expert Details"
          name="guru_details"
          value={formData.guru_details}
          onChange={handleChange}
          placeholder="Information about the expert/founder/guru behind the product - their background, credentials, story, and why they're qualified"
        />

        <TextareaField
          label="Case Study"
          name="case_study"
          value={formData.case_study}
          onChange={handleChange}
          placeholder="Share a success story or case study that demonstrates your results. Include specific details about the customer's journey, challenges, implementation, and outcomes."
        />
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 mt-auto flex justify-end items-center">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 mr-3 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !formData.name}
          className={`px-5 py-2 rounded-md text-white font-medium flex items-center gap-2 transition-all
            ${(isSubmitting || !formData.name)
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'}`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {submitButtonText}
            </>
          )}
        </button>
      </div>
    </form>
  )
}