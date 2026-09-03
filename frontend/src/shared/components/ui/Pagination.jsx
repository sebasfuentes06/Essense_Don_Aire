import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "../../utils/cn";
function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const getPageNumbers = () => {
    const pages = [];
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
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };
  return /* @__PURE__ */jsxs("div", {
    className: "flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-border",
    children: [/* @__PURE__ */jsxs("div", {
      className: "text-sm text-muted-foreground",
      children: ["Mostrando ", /* @__PURE__ */jsx("span", {
        className: "font-semibold text-foreground",
        children: startItem
      }), " a", " ", /* @__PURE__ */jsx("span", {
        className: "font-semibold text-foreground",
        children: endItem
      }), " de", " ", /* @__PURE__ */jsx("span", {
        className: "font-semibold text-foreground",
        children: totalItems
      }), " resultados"]
    }), /* @__PURE__ */jsxs("div", {
      className: "flex items-center gap-2",
      children: [/* @__PURE__ */jsx("button", {
        onClick: () => onPageChange(1),
        disabled: currentPage === 1,
        className: cn("h-9 w-9 rounded-lg flex items-center justify-center transition-colors", currentPage === 1 ? "text-muted-foreground cursor-not-allowed" : "text-foreground hover:bg-muted"),
        "aria-label": "Primera p\xE1gina",
        children: /* @__PURE__ */jsx(ChevronsLeft, {
          className: "h-4 w-4"
        })
      }), /* @__PURE__ */jsx("button", {
        onClick: () => onPageChange(currentPage - 1),
        disabled: currentPage === 1,
        className: cn("h-9 w-9 rounded-lg flex items-center justify-center transition-colors", currentPage === 1 ? "text-muted-foreground cursor-not-allowed" : "text-foreground hover:bg-muted"),
        "aria-label": "P\xE1gina anterior",
        children: /* @__PURE__ */jsx(ChevronLeft, {
          className: "h-4 w-4"
        })
      }), /* @__PURE__ */jsx("div", {
        className: "flex items-center gap-1",
        children: getPageNumbers().map((page, index) => typeof page === "number" ? /* @__PURE__ */jsx("button", {
          onClick: () => onPageChange(page),
          className: cn("h-9 min-w-[2.25rem] px-3 rounded-lg font-medium transition-colors", currentPage === page ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground hover:bg-muted"),
          children: page
        }, index) : /* @__PURE__ */jsx("span", {
          className: "h-9 px-2 flex items-center text-muted-foreground",
          children: page
        }, index))
      }), /* @__PURE__ */jsx("button", {
        onClick: () => onPageChange(currentPage + 1),
        disabled: currentPage === totalPages,
        className: cn("h-9 w-9 rounded-lg flex items-center justify-center transition-colors", currentPage === totalPages ? "text-muted-foreground cursor-not-allowed" : "text-foreground hover:bg-muted"),
        "aria-label": "P\xE1gina siguiente",
        children: /* @__PURE__ */jsx(ChevronRight, {
          className: "h-4 w-4"
        })
      }), /* @__PURE__ */jsx("button", {
        onClick: () => onPageChange(totalPages),
        disabled: currentPage === totalPages,
        className: cn("h-9 w-9 rounded-lg flex items-center justify-center transition-colors", currentPage === totalPages ? "text-muted-foreground cursor-not-allowed" : "text-foreground hover:bg-muted"),
        "aria-label": "\xDAltima p\xE1gina",
        children: /* @__PURE__ */jsx(ChevronsRight, {
          className: "h-4 w-4"
        })
      })]
    })]
  });
}
export { Pagination };