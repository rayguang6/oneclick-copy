"use client";

import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import { formUrlQuery, removeKeysFromUrlQuery } from "@/app/lib/url";
import { Input } from "@/components/ui/input";

interface Props {
  route: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
  iconPosition?: "left" | "right";
}

const LocalSearch = ({
  route,
  imgSrc,
  placeholder,
  otherClasses,
  iconPosition = "left",
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const previousQuery = useRef(query);

  useEffect(() => {
    // Only update if the query param has changed
    if (query !== previousQuery.current) {
      setSearchQuery(query);
      previousQuery.current = query;
    }
  }, [query]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Only proceed if the search query has actually changed from the URL query
      if (searchQuery === previousQuery.current) {
        return;
      }

      if (searchQuery) {
        const paramsWithoutPage = removeKeysFromUrlQuery({
          params: searchParams.toString(),
          keysToRemove: ["page"],
        });
        const newUrl = formUrlQuery({
          params: paramsWithoutPage,
          key: "query",
          value: searchQuery,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ["query", "page"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
      
      previousQuery.current = searchQuery;
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, router, route, searchParams, pathname]);

  return (
    <div
      className={`bg-white flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          width={24}
          height={24}
          alt="Search"
          className="cursor-pointer"
        />
      )}

      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
      />

      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          width={15}
          height={15}
          alt="Search"
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearch;
