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
  const filterParams = searchParams.get("filter");
  const [active, setActive] = useState(filterParams || "");
  const [filters, setFilters] = useState<Tag[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const previousFilter = useRef(filterParams || "");

  useEffect(() => {
    const loadTags = async () => {
      const tags = await getTagsForUser(userId);
      setFilters(tags);
    };
    loadTags();
  }, [userId]);

  // Keep active state in sync with URL
  useEffect(() => {
    if (filterParams !== previousFilter.current) {
      setActive(filterParams || "");
      previousFilter.current = filterParams || "";
    }
  }, [filterParams]);

  const handleTypeClick = (filter: string) => {
    // If already processing a click, ignore this one
    if (isProcessing) return;
    
    // If the filter hasn't actually changed, don't do anything
    if (filter === previousFilter.current) return;
    
    setIsProcessing(true);
    let newUrl = "";

    if (filter === active) {
      setActive("");
      newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ["filter", "page"],
      });
    } else {
      setActive(filter);
      const paramsWithoutPage = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ["page"],
      });
      newUrl = formUrlQuery({
        params: paramsWithoutPage,
        key: "filter",
        value: filter,
      });
    }

    // Add a small delay before processing the next click
    setTimeout(() => {
      router.push(newUrl, { scroll: false });
      previousFilter.current = filter === active ? "" : filter;
      setTimeout(() => {
        setIsProcessing(false);
      }, 300); // Allow new clicks after 300ms
    }, 100); // Push URL after 100ms
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 sm:flex">
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
    </div>
  );
};

export default HomeFilter;
