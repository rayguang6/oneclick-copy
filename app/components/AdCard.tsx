'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect, useCallback, useRef } from 'react';
import AdTagEditor from './ads/AdTagEditor';
import { getTagsForAd } from '../lib/actions/tags.actions';
import { createClient } from '@/app/utils/supabase/client';

interface AdCardProps {
    ad: Ad;
}

export default function AdCard({ ad }: AdCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [adTags, setAdTags] = useState<Tag[]>(Array.isArray(ad.tags) ? ad.tags : []);
    const [isLoadingTags, setIsLoadingTags] = useState(true);
    const [tagError, setTagError] = useState<string | null>(null);
    const [tagEditorAnchor, setTagEditorAnchor] = useState<DOMRect | null>(null);
    const [existingTranscript, setExistingTranscript] = useState<string | null>(ad.transcription ?? null);
    const [isCheckingTranscript, setIsCheckingTranscript] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const adLines = ad.ad_text?.split('\n') || [];
    const [showTagEditor, setShowTagEditor] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    // Load tags data
    const loadTags = useCallback(async () => {
        // if (!userId) return;
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

    // Load tags when userId is available
    useEffect(() => {
        if (userId) {
            loadTags();
        }
    }, [loadTags, userId]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleTagClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setTagEditorAnchor(rect);
        setShowTagEditor(true);
    };

    const handleTagsChange = (newTags: Tag[]) => {
        setAdTags(newTags);
    };

    const handleTagEditorClose = () => {
        setShowTagEditor(false);
        // Reload tags to ensure we have the latest data
        loadTags();
    };

    const handleThumbnailClick = () => {
        setShowVideo(true);
        // Play video after a short delay to ensure it's mounted
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play().catch(err => console.error('Error playing video:', err));
          }
        }, 100);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Library ID and Running Time Info */}
            <div className="p-3 border-b border-gray-200">
                <div className="text-[10px]">
                    <p className="text-gray-700">Library ID: {ad.library_id || 'N/A'}</p>
                    <p className="text-gray-700 mt-1">
                        Started running on {ad.started_running_on || 'N/A'}
                    </p>
                </div>
            </div>

            {/* Advertiser Info */}
            <div className="p-3 py-2 flex flex-row items-center gap-4">
                <div className="flex items-start ">
                    <Avatar className='w-8 h-8 me-2'>
                        <AvatarImage src={ad.profile_image_url} />
                        <AvatarFallback className='bg-gray-200 text-gray-400'>{ad.advertiser_name?.charAt(0) || ''}</AvatarFallback>
                    </Avatar>
                    {/* <img
                        src={ad.profile_image_url || '/images/profile-placeholder.png'}
                        alt={ad.advertiser_name || 'Advertiser'}
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/profile-placeholder.png'; }}
                        className="w-8 h-8 rounded-full mr-2 object-cover"
                    /> */}
                    <div>
                        <h3 className="font-bold text-gray-900 text-xs">{ad.advertiser_name || 'Unknown Advertiser'}</h3>
                        <p className="text-[10px] font-bold text-gray-500">Sponsored</p>
                    </div>
                </div>
            </div>

            {/* Ad Content */}
            <div className="p-3 pt-0">
                {/* Ad Text */}
                {ad.ad_text && (
                    <div>
                        <p className={`text-[10px] text-gray-700 mb-1 whitespace-pre-line ${isExpanded ? '' : 'line-clamp-7'}`}>
                            {ad.ad_text}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <button onClick={toggleExpand} className="text-blue-500 text-[10px]">
                                {isExpanded ? 'Show Less' : 'Show More'}
                            </button>
                        </div>
                        <button
                        // TODO: Implement rewrite ad
                            onClick={() => {}}
                            className="mb-2 text-[10px] bg-green-700 text-white px-2 py-1 rounded-sm cursor-pointer"
                        >
                            Swipe This Ad
                        </button>
                    </div>
                )}

                {/* Ad Media */}
                {ad.media_type === 'image' ? (
                    <img
                        src={ad.media_url}
                        alt="Ad content"
                        className="w-full h-[175px] object-contain"
                    />
                ) : ad.media_type === 'video' ? (
                    <div>
                        {!showVideo ? (
                            <div
                                className="relative cursor-pointer group"
                                onClick={handleThumbnailClick}
                            >
                                <img
                                    src={ad.thumbnail_url ?? '/images/video-placeholder.png'}
                                    alt="Video thumbnail"
                                    className="w-full h-[175px] object-contain bg-gray-100"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-opacity">
                                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-black bg-opacity-50 group-hover:bg-opacity-70">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <video
                                ref={videoRef}
                                src={ad.media_url}
                                controls
                                className="w-full h-[175px] object-contain bg-gray-100"
                            />
                        )}
                        {/* Lazy load transcript UI */}
                        {(
                            // <VideoTranscriptUI
                            //     adId={ad.id}
                            //     mediaType={ad.media_type}
                            //     initialTranscript={existingTranscript}
                            // />
                            <div>
                                <p>Transcript</p>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>

            {/* Tags Section */}
            <div
                className="flex flex-wrap gap-1.5 items-center min-h-[24px] cursor-pointer hover:bg-gray-50 transition-colors p-1 rounded"
                onClick={handleTagClick}
            >
                {adTags.length > 0 ? (
                    adTags.map((tag) => (
                        <div
                            key={tag.id}
                            className="px-2 py-0.5 text-xs rounded"
                            style={{ backgroundColor: tag.color || '#E5E7EB' }}
                        >
                            {tag.name}
                        </div>
                    ))
                ) : (
                    <span className="text-gray-400 text-sm">Add tags...</span>
                )}
            </div>

            {/* Tag Editor */}
            {showTagEditor && (
                <AdTagEditor
                    adId={ad.id}
                    onClose={handleTagEditorClose}
                    anchorRect={tagEditorAnchor}
                    currentTags={adTags}
                    onTagsChange={handleTagsChange}
                />
            )}
        </div>
    );
}