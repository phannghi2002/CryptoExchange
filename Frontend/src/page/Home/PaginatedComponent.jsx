import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Replace with actual import

const PaginatedComponent = ({ currentPage, onPageChange }) => {
  const totalPages = 10;
  const maxVisiblePages = 3;

  const getVisiblePages = () => {
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <Pagination>
      <PaginationContent className="cursor-pointer">
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} />
          </PaginationItem>
        )}

        {currentPage > maxVisiblePages && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
            </PaginationItem>
            <PaginationEllipsis />
          </>
        )}

        {getVisiblePages().map((page) => (
          <PaginationItem key={page} active={page === currentPage}>
            <PaginationLink
              onClick={() => onPageChange(page)}
              style={{
                backgroundColor:
                  page === currentPage ? "#007bff" : "transparent",
                color: "#fff",
                borderRadius: "5px",
                padding: "0.5rem",
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {currentPage < totalPages - Math.floor(maxVisiblePages / 2) && (
          <>
            <PaginationEllipsis />
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext onClick={() => onPageChange(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginatedComponent;
