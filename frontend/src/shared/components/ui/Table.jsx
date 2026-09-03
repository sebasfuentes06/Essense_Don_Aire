import { jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { cn } from "../../utils/cn";
const Table = forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */jsx("div", {
  className: "w-full overflow-x-auto rounded-xl border border-border bg-card",
  children: /* @__PURE__ */jsx("table", {
    ref,
    className: cn("w-full min-w-[720px] caption-bottom text-sm", className),
    ...props
  })
}));
Table.displayName = "Table";
const TableHeader = forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */jsx("thead", {
  ref,
  className: cn("bg-muted/50", className),
  ...props
}));
TableHeader.displayName = "TableHeader";
const TableBody = forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */jsx("tbody", {
  ref,
  className: cn("[&_tr:last-child]:border-0", className),
  ...props
}));
TableBody.displayName = "TableBody";
const TableRow = forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */jsx("tr", {
  ref,
  className: cn("border-b border-border transition-colors hover:bg-muted/50", className),
  ...props
}));
TableRow.displayName = "TableRow";
const TableHead = forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */jsx("th", {
  ref,
  className: cn("h-12 px-4 text-left align-middle font-semibold text-foreground whitespace-nowrap", className),
  ...props
}));
TableHead.displayName = "TableHead";
const TableCell = forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */jsx("td", {
  ref,
  className: cn("p-4 align-middle text-foreground", className),
  ...props
}));
TableCell.displayName = "TableCell";
export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };