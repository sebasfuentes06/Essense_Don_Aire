import { jsx, jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../shared/components/ui/Card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";
function CategoryPieChart({ data, colors }) {
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Ventas por Categor\xEDa" }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(PieChart, { children: [
      /* @__PURE__ */ jsx(
        Pie,
        {
          data,
          cx: "50%",
          cy: "50%",
          labelLine: false,
          label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`,
          outerRadius: 80,
          fill: "#8884d8",
          dataKey: "value",
          children: data.map((entry, index) => /* @__PURE__ */ jsx(Cell, { fill: colors[index % colors.length] }, `cell-${index}`))
        }
      ),
      /* @__PURE__ */ jsx(Tooltip, { contentStyle: { backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px" } })
    ] }) }) })
  ] });
}
export {
  CategoryPieChart
};
