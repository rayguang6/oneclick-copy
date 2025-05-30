"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { formUrlQuery } from "@/lib/url";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface Props {
  page: number | undefined | string;
  totalPages: number;
  containerClasses?: string;
}

const Pagination = ({ page = 1, totalPages, containerClasses }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(page);

  // Redirect to page 1 if current page is invalid
  if (currentPage > totalPages && totalPages > 0) {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: "1",
    });
    router.push(newUrl);
    return null;
  }

  const handleNavigation = (targetPage: number) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: targetPage.toString(),
    });

    router.push(newUrl);
  };

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const maxButtons = 10;
    const pageNumbers: number[] = [];
    
    if (totalPages <= maxButtons) {
      // If total pages is less than max buttons, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      let startPage = Math.max(2, currentPage - 2);
      let endPage = Math.min(totalPages - 1, currentPage + 2);
      
      // Adjust start and end to show more pages on either side if needed
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, maxButtons - 2);
      }
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - maxButtons + 2);
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push(-1); // -1 represents ellipsis
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push(-1); // -1 represents ellipsis
      }
      
      // Always include last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <div
      className={cn(
        "flex w-full items-center justify-center gap-2 mt-5",
        containerClasses
      )}
    >
      {/* Previous Page Button */}
      <Button
        onClick={() => handleNavigation(currentPage - 1)}
        disabled={currentPage === 1}
        className="cursor-pointer btn flex min-h-[36px] items-center justify-center gap-2 border hover:bg-gray-700"
      >
        <p className="">Prev</p>
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {getPageNumbers().map((pageNum, index) => (
          pageNum === -1 ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2">
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => handleNavigation(pageNum)}
              disabled={pageNum === currentPage}
              className={`min-w-[36px] rounded-md px-3.5 py-2 cursor-pointer ${
                pageNum === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {pageNum}
            </button>
          )
        ))}
      </div>

      {/* Next Page Button */}
      <Button
        onClick={() => handleNavigation(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="cursor-pointer btn flex min-h-[36px] items-center justify-center gap-2 border hover:bg-gray-700"
      >
        <p className="">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
