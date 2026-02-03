"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { ComponentProps } from "react";

type SpPaginationProps = ComponentProps<typeof Pagination> & {
  totalPages?: number;
  totalCount?: number;
  pageSize?: number;
  windowSize?: number;
  pageParamName?: string;
};

function SpPagination({
  totalPages,
  totalCount,
  pageSize,
  windowSize = 5,
  pageParamName = "pageNumber",
  className,
  ...props
}: SpPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Calculate total pages
  const calculatedTotalPages =
    totalPages ??
    (totalCount && pageSize ? Math.ceil(totalCount / pageSize) : 1);

  // Get current page from searchParams
  const currentPage = +(searchParams?.get(pageParamName) || "1") || 1;

  // Calculate which pages to show
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const halfWindow = Math.floor(windowSize / 2);

    if (calculatedTotalPages <= windowSize) {
      // Show all pages if total is less than window size
      for (let i = 1; i <= calculatedTotalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - halfWindow);
      let end = Math.min(calculatedTotalPages, currentPage + halfWindow);

      // Adjust if we're near the beginning
      if (currentPage <= halfWindow) {
        end = Math.min(windowSize, calculatedTotalPages);
      }

      // Adjust if we're near the end
      if (currentPage > calculatedTotalPages - halfWindow) {
        start = Math.max(1, calculatedTotalPages - windowSize + 1);
      }

      // Add first page and ellipsis if needed
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push("ellipsis");
        }
      }

      // Add page numbers in window
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis and last page if needed
      if (end < calculatedTotalPages) {
        if (end < calculatedTotalPages - 1) {
          pages.push("ellipsis");
        }
        pages.push(calculatedTotalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < calculatedTotalPages;

  const handlePageChange = (page: number) => {
    const sp = new URLSearchParams(searchParams?.toString());
    if (page === 1) {
      sp.delete(pageParamName);
    } else {
      sp.set(pageParamName, page.toString());
    }
    router.push(`${pathname}?${sp.toString()}`, {
      scroll: false
    });
  };

  if (calculatedTotalPages <= 1) {
    return null;
  }

  return (
    <Pagination className={className} {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault();
              if (hasPrevious) {
                handlePageChange(currentPage - 1);
              }
            }}
            className={!hasPrevious ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page);
                }}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault();
              if (hasNext) {
                handlePageChange(currentPage + 1);
              }
            }}
            className={!hasNext ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default SpPagination;
