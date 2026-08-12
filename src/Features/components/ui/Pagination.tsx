import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-border">
      {/* Items Info */}
      <div className="text-sm text-muted-foreground">
        Mostrando <span className="font-semibold text-foreground">{startItem}</span> a{' '}
        <span className="font-semibold text-foreground">{endItem}</span> de{' '}
        <span className="font-semibold text-foreground">{totalItems}</span> resultados
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            'h-9 w-9 rounded-lg flex items-center justify-center transition-colors',
            currentPage === 1
              ? 'text-muted-foreground cursor-not-allowed'
              : 'text-foreground hover:bg-muted'
          )}
          aria-label="Primera página"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'h-9 w-9 rounded-lg flex items-center justify-center transition-colors',
            currentPage === 1
              ? 'text-muted-foreground cursor-not-allowed'
              : 'text-foreground hover:bg-muted'
          )}
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <button
                key={index}
                onClick={() => onPageChange(page)}
                className={cn(
                  'h-9 min-w-[2.25rem] px-3 rounded-lg font-medium transition-colors',
                  currentPage === page
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                {page}
              </button>
            ) : (
              <span
                key={index}
                className="h-9 px-2 flex items-center text-muted-foreground"
              >
                {page}
              </span>
            )
          ))}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'h-9 w-9 rounded-lg flex items-center justify-center transition-colors',
            currentPage === totalPages
              ? 'text-muted-foreground cursor-not-allowed'
              : 'text-foreground hover:bg-muted'
          )}
          aria-label="Página siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            'h-9 w-9 rounded-lg flex items-center justify-center transition-colors',
            currentPage === totalPages
              ? 'text-muted-foreground cursor-not-allowed'
              : 'text-foreground hover:bg-muted'
          )}
          aria-label="Última página"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
