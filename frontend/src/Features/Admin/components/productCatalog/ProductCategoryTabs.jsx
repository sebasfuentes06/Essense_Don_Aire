import { jsx } from "react/jsx-runtime";
import { cn } from "../../../../shared/utils/cn";
function ProductCategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory
}) {
  return /* @__PURE__ */jsx("div", {
    className: "flex gap-2 overflow-x-auto pb-2",
    children: categories.map(category => /* @__PURE__ */jsx("button", {
      onClick: () => onSelectCategory(category),
      className: cn("px-6 py-2.5 rounded-xl font-medium transition-all duration-200 whitespace-nowrap", selectedCategory === category ? "bg-primary text-primary-foreground shadow-sm" : "bg-card text-foreground hover:bg-muted border border-border"),
      children: category
    }, category))
  });
}
export { ProductCategoryTabs };