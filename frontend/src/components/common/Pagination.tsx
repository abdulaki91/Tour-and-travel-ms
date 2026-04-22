import React from "react";
import Button from "../ui/Button";

interface PaginationInfo {
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
}) => {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center space-x-4 mt-8">
      <Button
        variant="outline"
        disabled={!pagination.hasPrev}
        onClick={() => onPageChange(pagination.page - 1)}
        className="shadow-md hover:shadow-lg"
      >
        Previous
      </Button>

      <span className="text-sm text-gray-600 font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
        Page {pagination.page} of {pagination.totalPages}
      </span>

      <Button
        variant="outline"
        disabled={!pagination.hasNext}
        onClick={() => onPageChange(pagination.page + 1)}
        className="shadow-md hover:shadow-lg"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
