import { jsx, jsxs } from "react/jsx-runtime";
import { Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
function CategoriesHeader({
  onNewCategory
}) {
  return /* @__PURE__ */jsxs("div", {
    className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4",
    children: [/* @__PURE__ */jsxs("div", {
      children: [/* @__PURE__ */jsx("h1", {
        className: "text-4xl font-bold text-foreground mb-2",
        children: "Categor\xEDas"
      }), /* @__PURE__ */jsx("p", {
        className: "text-muted-foreground",
        children: "Administra las categor\xEDas de tus productos"
      })]
    }), /* @__PURE__ */jsxs(Button, {
      onClick: onNewCategory,
      children: [/* @__PURE__ */jsx(Plus, {
        className: "h-5 w-5"
      }), "Nueva Categor\xEDa"]
    })]
  });
}
export { CategoriesHeader };