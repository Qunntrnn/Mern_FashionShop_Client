import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

function Pagination({ pagination, onPageChange }) {
  const { page, totalPages } = pagination;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(1)}
        disabled={page === 1}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">Trang</span>
        <span className="text-sm font-medium">{page}</span>
        <span className="text-sm font-medium">/</span>
        <span className="text-sm font-medium">{totalPages}</span>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(totalPages)}
        disabled={page === totalPages}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default Pagination; 