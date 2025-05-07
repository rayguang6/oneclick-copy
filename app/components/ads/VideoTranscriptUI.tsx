'use client';

import { useState, useRef, useEffect } from 'react';
import { getVideoTranscript } from '@/app/lib/actions/transcript.actions';
import { getUserProjects } from '@/app/lib/actions/project.actions';
import CreditIcon from '@/app/components/ui/CreditIcon';

interface VideoTranscriptUIProps {
  adId: string;
  mediaType?: string;
  initialTranscript?: string | null;
}

export default function VideoTranscriptUI({ adId, mediaType, initialTranscript = null }: VideoTranscriptUIProps) {
  const [transcript, setTranscript] = useState<string | null>(initialTranscript);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const hasTranscript = !!transcript;

  //todo  this might not needed useeffect?
  useEffect(() => {
    if (transcript) {
      // console.log(`Transcript content exists, length: ${transcript.length}`);
    }
  }, [adId, initialTranscript, transcript, isOpen]);

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (transcriptRef.current && !transcriptRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleGetTranscript = async () => {
    if (hasTranscript) {
      console.log(`Toggling transcript visibility from ${isOpen} to ${!isOpen}`);
      setIsOpen(!isOpen);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    console.log(`Fetching transcript for ad ${adId}`);
    
    try {
      const response = await getVideoTranscript(adId);
      
      if (response.error) {
        console.error(`Error from transcript API: ${response.error}`);
        setError(response.error);
      } else {
        console.log(`Received transcript: ${response.text ? 'yes' : 'no'}, length: ${response.text?.length || 0}`);
        setTranscript(response.text);
        setIsOpen(true);
      }
    } catch (err) {
      console.error('Error fetching transcript:', err);
      setError('Failed to load transcript');
    } finally {
      setIsLoading(false);
    }
  };

  //function to swipe and clone this to project chat
  // const handleRegenerateButtonClick = async () => {
  //   if (!transcript) {
  //     alert('No transcript available to generate content');
  //     return;
  //   }
    
  //   try {
  //     const projects = await getUserProjects();
  //     if (!projects || projects.length === 0) {
  //       alert('No projects found. Please create a project first.');
  //       return;
  //     }
      
  //     const latestProject = projects[0];
  //     const timestamp = new Date().getTime();
  //     const storageKey = `transcript_for_generation_${timestamp}`;
      
  //     localStorage.setItem(storageKey, transcript);
  //     localStorage.setItem('latest_transcript_key', storageKey);
      
  //     const TRANSCRIPT_FRAMEWORK = 'cdc6d49e-9474-48aa-9efb-4095710ad011';
  //     const url = `/project/${latestProject.id}/tool/regenerate-ads?framework=${TRANSCRIPT_FRAMEWORK}&ts=${timestamp}&autogenerate=true`;
      
  //     window.open(url, '_blank');
  //   } catch (err) {
  //     console.error('Error:', err);
  //     alert(`Failed to open content generator: ${err instanceof Error ? err.message : 'Unknown error'}`);
  //   }
  // };

  const closeTranscript = () => {
    // console.log('Explicitly closing transcript');
    setIsOpen(false);
  };
  
  const toggleTranscript = () => {
    // console.log(`Toggling transcript from ${isOpen} to ${!isOpen}`);
    setIsOpen(!isOpen);
  };

  if (mediaType !== 'video') {
    return null;
  }

  const buttonText = isLoading
    ? "Processing..."
    : hasTranscript
      ? (isOpen ? "Hide transcript" : "Show transcript")
      : "1 Generate Video transcript";

  return (
    <div className="relative mt-2" ref={transcriptRef}>
      {/* Main Button */}
      <button
        onClick={hasTranscript ? toggleTranscript : handleGetTranscript}
        disabled={isLoading}
        className={`
          flex items-center gap-1.5 text-xs font-medium px-6 cursor-pointer py-3 rounded
          ${isLoading
            ? 'bg-gray-200 text-gray-500 cursor-wait'
            : hasTranscript
              ? (isOpen
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-green-50 text-green-700 hover:bg-green-100')
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }
          transition-colors duration-200
        `}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {buttonText}
          </>
        ) : hasTranscript ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {buttonText}
          </>
        ) : (
          <>
            <CreditIcon className="w-3 h-3 text-purple-700 mr-1" fillColor="currentColor" />
            {buttonText}
          </>
        )}
      </button>
      
      {error && (
        <div className="mt-2 text-xs text-red-500">
          {error}
        </div>
      )}
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-1 text-xs text-gray-400">
          isOpen: {isOpen ? 'true' : 'false'}, hasTranscript: {hasTranscript ? 'true' : 'false'}
        </div>
      )}
      
      {hasTranscript && isOpen && (
        <div className="mt-2 p-3 rounded-md border border-gray-200 bg-gray-50 text-xs text-gray-700 whitespace-pre-line">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-semibold text-gray-700">Video Transcript</h3>
            <div className="flex gap-2">
              <button
                // onClick={handleRegenerateButtonClick}
                className="text-xs bg-green-700 text-white px-2 py-1 rounded-sm cursor-pointer"
              >
                Swipe This Script
              </button>
              <button
                onClick={() => {
                  if (transcript) {
                    navigator.clipboard.writeText(transcript);
                    alert('Transcript copied to clipboard');
                  }
                }}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Copy
              </button>
              <button
                onClick={closeTranscript}
                className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
          <p className="text-xs leading-relaxed">
            {transcript}
          </p>
        </div>
      )}
    </div>
  );
} 