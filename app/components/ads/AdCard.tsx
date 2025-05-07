'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect, useCallback, useRef } from 'react';
import AdTagEditor from './AdTagEditor';
import { getTagsForAd } from '../../../lib/actions/tags.actions';
import { createClient } from '@/app/utils/supabase/client';

import { createPortal } from 'react-dom';
import VideoTranscriptUI from './VideoTranscriptUI';

interface AdCardProps {
    ad: Ad;
    readOnly?: boolean;
}

export default function AdCard({ ad, readOnly = false }: AdCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adTags, setAdTags] = useState<Tag[]>(Array.isArray(ad.tags) ? ad.tags : []);
    const [isLoadingTags, setIsLoadingTags] = useState(true);
    const [tagError, setTagError] = useState<string | null>(null);
    const [tagEditorAnchor, setTagEditorAnchor] = useState<DOMRect | null>(null);
    const [existingTranscript, setExistingTranscript] = useState<string | null>(ad.transcription ?? null);
    const [showVideo, setShowVideo] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [showTagEditor, setShowTagEditor] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

    // Load tags data
    const loadTags = useCallback(async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || null;
        if (!userId) return;
        
        try {
            setIsLoadingTags(true);
            setTagError(null);
            const tags = await getTagsForAd(ad.id, userId);
            setAdTags(tags);
        } catch (error) {
            console.error('Error loading tags:', error);
            setTagError('Failed to load tags');
        } finally {
            setIsLoadingTags(false);
        }
    }, [ad.id, userId]);

    useEffect(() => {
        if (userId) {
            loadTags();
        }
    }, [loadTags, userId]);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        document.body.style.overflow = !isModalOpen ? 'hidden' : 'auto';
    };

    // Handle click outside modal
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isModalOpen && modalRef.current && !modalRef.current.contains(event.target as Node)) {
                toggleModal();
            }
        };

        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleTagClick = (event: React.MouseEvent<HTMLDivElement>, inModal: boolean = false) => {
        event.stopPropagation();
        const rect = event.currentTarget.getBoundingClientRect();
        
        // If in modal, adjust position based on modal scroll
        if (inModal) {
            const scrollContainer = event.currentTarget.closest('.overflow-y-auto');
            const scrollTop = scrollContainer ? scrollContainer.scrollTop : 0;
            const modalRect = modalRef.current?.getBoundingClientRect();
            
            if (modalRect) {
                setTagEditorAnchor({
                    ...rect,
                    top: rect.top + scrollTop,
                    left: rect.left - modalRect.left
                });
            }
        } else {
            setTagEditorAnchor(rect);
        }
        setShowTagEditor(true);
    };

    const handleTagsChange = (newTags: Tag[]) => {
        setAdTags(newTags);
    };

    const handleTagEditorClose = () => {
        setShowTagEditor(false);
        loadTags();
    };

    // const handleThumbnailClick = (e: React.MouseEvent) => {
    //     e.stopPropagation();
    //     setShowVideo(true);
    //     setTimeout(() => {
    //       if (videoRef.current) {
    //         videoRef.current.play().catch(err => console.error('Error playing video:', err));
    //       }
    //     }, 100);
    // };

    const handleSwipeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Add your swipe functionality here
        console.log('Alert' );
    };

    // Auto-play video when modal opens
    useEffect(() => {
        if (isModalOpen && videoRef.current && ad.media_type === 'video') {
            videoRef.current.play().catch(err => console.error('Error auto-playing video:', err));
        }
    }, [isModalOpen, ad.media_type]);

    return (
        <>
            <div 
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[500px] cursor-pointer hover:shadow-md transition-shadow duration-200"
                onClick={toggleModal}
            >
                {/* Library ID and Running Time Info */}
                <div className="p-3 border-b border-gray-200 shrink-0">
                    <div className="text-[10px]">
                        <p className="text-gray-700">Library ID: {ad.library_id || 'N/A'}</p>
                        <p className="text-gray-700 mt-1">
                            Started running on {ad.started_running_on || 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Advertiser Info */}
                <div className="p-3 py-2 flex flex-row items-center gap-4 border-b border-gray-200 shrink-0">
                    <div className="flex items-start">
                        <Avatar className='w-8 h-8 me-2'>
                            <AvatarImage src={ad.profile_image_url} />
                            <AvatarFallback className='bg-gray-200 text-gray-400'>{ad.advertiser_name?.charAt(0) || ''}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-bold text-gray-900 text-xs">{ad.advertiser_name || 'Unknown Advertiser'}</h3>
                            <p className="text-[10px] font-bold text-gray-500">Sponsored</p>
                        </div>
                    </div>
                </div>

                {/* Content Preview */}
                <div className="flex-1 min-h-0 flex flex-col">
                    {/* Ad Text Preview */}
                    {ad.ad_text && (
                        <div className="p-3 pb-2 shrink-0">
                            <div className="relative h-[100px] overflow-hidden">
                                <p className="text-[10px] text-gray-700 mb-1 whitespace-pre-line">
                                    {ad.ad_text}
                                </p>
                                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
                            </div>
                            
                        </div>
                    )}

                    {/* Media Preview */}
                    <div className="flex-1 min-h-0 relative bg-gray-50">
                        {ad.media_type === 'image' ? (
                            <img
                                src={ad.media_url}
                                alt="Ad content"
                                className="w-full h-full object-contain"
                            />
                        ) : ad.media_type === 'video' ? (
                            <div className="h-full">
                                <div
                                    className="relative cursor-pointer group h-full"
                                    // onClick={handleThumbnailClick}
                                >
                                    <img
                                        src={ad.thumbnail_url ?? '/images/video-placeholder.png'}
                                        alt="Video thumbnail"
                                        className="w-full h-full object-contain"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-opacity">
                                        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-black bg-opacity-50 group-hover:bg-opacity-70">
                                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Tags Section */}
                <div
                    className="mt-auto border-t border-gray-200 flex flex-wrap gap-1.5 items-center min-h-[40px] hover:bg-gray-50 transition-colors p-2 shrink-0"
                    onClick={(e) => !readOnly && handleTagClick(e, false)}
                >
                    {adTags.length > 0 ? (
                        adTags.map((tag) => (
                            <div
                                key={tag.id}
                                className="px-2 py-0.5 text-xs rounded transition-all duration-200 hover:opacity-90"
                                style={{ backgroundColor: tag.color }}
                            >
                                {tag.name}
                            </div>
                        ))
                    ) : (
                        <span className="text-gray-400 text-sm">Add tags...</span>
                    )}
                </div>
            </div>


{/* ****************************************************** */}
            {/* Modal POPUP*/}
{/* ****************************************************** */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={toggleModal}
                    />
                    
                    {/* Modal Content */}
                    <div 
                        ref={modalRef}
                        className="relative bg-white rounded-xl shadow-xl w-full max-w-7xl h-[90vh] flex flex-col md:flex-row overflow-hidden"
                    >
                        {/* Left Side - Media */}
                        <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-4 md:p-6">
                            {ad.media_url && (
                                <div className="relative w-full h-full flex items-center">
                                    {ad.media_type === 'image' ? (
                                        <img
                                            src={ad.media_url}
                                            alt="Ad content"
                                            className="rounded-lg object-contain w-full h-full max-h-[70vh]"
                                        />
                                    ) : ad.media_type === 'video' ? (
                                        <video
                                            ref={videoRef}
                                            src={ad.media_url}
                                            controls
                                            playsInline
                                            className="rounded-lg object-contain w-full h-full max-h-[70vh]"
                                        />
                                    ) : null}
                                </div>
                            )}
                        </div>

                        {/* Right Side - Content */}
                        <div className="md:w-1/2 flex flex-col h-full">
                            <div className="p-4 md:p-6 overflow-y-auto">
                                {/* Close Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleModal();
                                    }}
                                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>


                                    {/* Header */}
                                    <div className="flex items-center gap-3 mb-6 py-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={ad.profile_image_url} />
                                            <AvatarFallback>{ad.advertiser_name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold text-lg">{ad.advertiser_name}</h3>
                                            <p className="text-sm text-gray-500">Sponsored</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 py-4">
                                        {/* Ad Text */}
                                        <div className="prose max-w-none">
                                            
                                            <p className="whitespace-pre-wrap text-gray-700">{ad.ad_text}</p>
                                            <button
                                                onClick={handleSwipeClick}
                                                className="text-[10px] bg-primary-500 mt-2 mb-2 text-white px-2 py-1 rounded-sm cursor-pointer hover:bg-primary-600 transition-colors"
                                            >
                                                <p className='text-md'>
                                                    ✏️ Swipe & Rewrite Ads
                                                </p>
                                            </button>
                                        </div>

                                        {/* Video Transcript UI */}
                                        <VideoTranscriptUI
                                            adId={ad.id}
                                                mediaType={ad.media_type}
                                                initialTranscript={existingTranscript}
                                            />
                                    </div>

                                {/* Tags Section */}
                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2">Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {adTags.map((tag) => (
                                            <div
                                                key={tag.id}
                                                className="px-2 py-0.5 text-xs rounded transition-all duration-200 hover:opacity-90"
                                                style={{ backgroundColor: tag.color }}
                                            >
                                                {tag.name}
                                            </div>
                                        ))}
                                        {/* <button
                                            onClick={(e) => handleTagClick(e, true)}
                                            className="px-2 py-0.5 text-xs rounded border border-gray-200 hover:bg-gray-50 transition-colors"
                                        >
                                            + Add Tag
                                        </button> */}
                                    </div>
                                </div>

                                {/* Additional Details */}
                                <div className="border-t mt-4 pt-4">
                                    <h4 className="font-medium mb-2">Additional Details</h4>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p>Created: {ad.created_at ? new Date(ad.created_at).toLocaleDateString() : 'Not available'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Tag Editor Portal */}
            {/* Only show tag editor if not read only */}
            {showTagEditor && !readOnly && createPortal(
                <AdTagEditor
                    adId={ad.id}
                    onClose={handleTagEditorClose}
                    anchorRect={tagEditorAnchor}
                    currentTags={adTags}
                    onTagsChange={handleTagsChange}
                />,
                document.body
            )}
        </>
    );
}