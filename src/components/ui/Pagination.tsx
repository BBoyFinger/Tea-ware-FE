import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`mx-1 px-3 py-1 border rounded-lg ${
            currentPage === i ? "bg-blue-500 text-white" : "bg-white text-black"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="mt-4 flex justify-between items-center">
      <div>
        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
        entries
      </div>
      <div className="flex items-center">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="mr-2 px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          <FiChevronLeft />
        </button>

        {/* Render các số trang */}
        {renderPageNumbers()}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="ml-2 px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
