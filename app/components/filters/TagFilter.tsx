'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTagStore } from '@/app/store/tagStore';


interface TagSelectorProps {
  selectedTagId: string | null; // Changed from array to single string or null
  onTagSelect: (tagId: string | null) => void; // Changed function signature
  customTags?: Tag[]; // Optional prop for custom tags (like admin's tags)
}

export default function TagSelector({ selectedTagId, onTagSelect, customTags }: TagSelectorProps) {
  const { tags: storeTags, isLoading, initialize } = useTagStore();
  const [displayTags, setDisplayTags] = useState<Tag[]>([]);
  
  // Initialize tag store (for user's own tags)
  useEffect(() => {
    if (!customTags) {
      initialize();
    }
  }, [initialize, customTags]);
  
  // Use either customTags or store tags
  useEffect(() => {
    if (customTags) {
      setDisplayTags(customTags);
    } else {
      setDisplayTags(storeTags);
    }
  }, [customTags, storeTags]);

  if (isLoading && !customTags) {
    return (
      <div className="flex justify-center my-6">
        <div className="animate-pulse flex flex-wrap gap-2 justify-center max-w-3xl">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-8 w-24 bg-gray-200 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  if (displayTags.length === 0) return null;

  // Handle tag click - if tag is already selected, deselect it, otherwise select it
  const handleTagClick = (tagId: string) => {
    if (selectedTagId === tagId) {
      // If clicking the already selected tag, deselect it
      onTagSelect(null);
    } else {
      // Otherwise, select the clicked tag
      onTagSelect(tagId);
    }
  };

  return (
    <div className="my-6">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          className="flex flex-wrap gap-2 justify-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {displayTags.map(tag => {
            const isSelected = selectedTagId === tag.id;
            return (
              <motion.button
                key={tag.id}
                onClick={() => handleTagClick(tag.id)}
                className={`
                  relative px-4 py-1.5 rounded-md text-sm font-medium
                  transition-all duration-200 ease-in-out
                  border-2 cursor-pointer
                  ${isSelected 
                    ? 'bg-white hover:opacity-90' 
                    : 'hover:opacity-90'
                  }
                `}
                style={{ 
                  backgroundColor: isSelected ? 'white' : tag.color || '#F3F4F6',
                  borderColor: tag.color || '#F3F4F6',
                  color: '#000000',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                layout
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  {tag.name}
                  {isSelected && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3.5 h-3.5 text-black"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                  )}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
        {selectedTagId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex justify-center"
          >
            <button
              onClick={() => onTagSelect(null)}
              className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 
                bg-white border border-gray-200 rounded-md hover:bg-gray-50 
                transition-colors duration-200"
            >
              Clear filter
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}