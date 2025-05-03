"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback, useRef } from "react";

import { formUrlQuery, removeKeysFromUrlQuery } from "@/app/lib/url";
import { cn } from "@/app/lib/utils";

import { Button } from "@/components/ui/button";
import { getTagsForUser } from "@/app/lib/actions/tags.actions";
import { Tag } from "@/app/types/global";

interface HomeFilterProps {
  userId: string;
}

const HomeFilter = ({ userId }: HomeFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Tag[]>([]);
  const [active, setActive] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const tags = await getTagsForUser(userId);
        setFilters(tags);
      } catch (error) {
        console.error('Error loading filters:', error);
      }
    };

    if (userId) {
      loadFilters();
    }
  }, [userId]);

  useEffect(() => {
    const filterValue = searchParams.get('filter');
    setActive(filterValue || '');
  }, [searchParams]);

  const handleTypeClick = useCallback(
    (tagId: string) => {
      if (isProcessing) return;
      setIsProcessing(true);

      let newUrl;
      if (active === tagId) {
        // If clicking active filter, remove it
        newUrl = removeKeysFromUrlQuery({
          params: searchParams.toString(),
          keysToRemove: ['filter', 'page'],
        });
        setActive('');
      } else {
        // Set new filter
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'filter',
          value: tagId,
        });
        setActive(tagId);
      }

      router.push(newUrl);
      setIsProcessing(false);
    },
    [active, isProcessing, router, searchParams]
  );

  const handleClearFilters = useCallback(() => {
    if (isProcessing) return;
    setIsProcessing(true);

    const newUrl = removeKeysFromUrlQuery({
      params: searchParams.toString(),
      keysToRemove: ['filter', 'page'],
    });

    setActive('');
    router.push(newUrl);
    setIsProcessing(false);
  }, [isProcessing, router, searchParams]);

  return (
    <div className="mt-10 flex flex-col gap-3 sm:flex">
      <div className="flex flex-wrap items-center gap-3">
        {filters.map((filter) => (
          <button key={filter.id}
            onClick={() => handleTypeClick(filter.id)}
            disabled={isProcessing}
            className={`
              px-4 py-1.5 rounded-md text-sm font-medium
              transition-all duration-200 ease-in-out
              ${isProcessing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              ${active === filter.id 
                ? 'shadow-sm' 
                : 'hover:opacity-80'
              }
            `}
            style={{
              backgroundColor: active === filter.id 
                ? 'white' 
                : `${filter.color}`,
              color: active === filter.id 
                ? '#000'
                : '#000',
              border: `2px solid ${active === filter.id ? filter.color : 'transparent'}`,
            }}
          >
            {filter.name}
            {active === filter.id && (
              <span className="ml-1.5">✓</span>
            )}
          </button>
        ))}
        
        {active && (
          <button
            onClick={handleClearFilters}
            disabled={isProcessing}
            className={`
              px-4 py-1.5 rounded-md text-sm font-medium bg-gray-100
              transition-all duration-200 ease-in-out hover:bg-gray-200
              ${isProcessing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            `}
          >
            Clear Filter
          </button>
        )}
      </div>
    </div>
  );
};

export default HomeFilter;
