import { jsx, jsxs } from "react/jsx-runtime";
import { Download } from "lucide-react";
import { Button } from "../../../../shared/components/ui/Button";
import { Select } from "../../../../shared/components/ui/Select";
function ReportsHeader({
  period,
  onPeriodChange,
  periodOptions
}) {
  return /* @__PURE__ */jsxs("div", {
    className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4",
    children: [/* @__PURE__ */jsxs("div", {
      children: [/* @__PURE__ */jsx("h1", {
        className: "text-4xl font-bold text-foreground mb-2",
        children: "Reportes"
      }), /* @__PURE__ */jsx("p", {
        className: "text-muted-foreground",
        children: "Vista general y an\xE1lisis de tu negocio"
      })]
    }), /* @__PURE__ */jsxs("div", {
      className: "flex gap-3",
      children: [/* @__PURE__ */jsx(Select, {
        value: period,
        onChange: onPeriodChange,
        options: periodOptions
      }), /* @__PURE__ */jsxs(Button, {
        children: [/* @__PURE__ */jsx(Download, {
          className: "h-5 w-5"
        }), "Exportar PDF"]
      })]
    })]
  });
}
export { ReportsHeader };