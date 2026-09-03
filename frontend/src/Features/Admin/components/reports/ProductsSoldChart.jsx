import { jsx, jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../shared/components/ui/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
function ProductsSoldChart({ data }) {
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Productos Vendidos" }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(BarChart, { data, children: [
      /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border)" }),
      /* @__PURE__ */ jsx(XAxis, { dataKey: "month", stroke: "var(--muted-foreground)" }),
      /* @__PURE__ */ jsx(YAxis, { stroke: "var(--muted-foreground)" }),
      /* @__PURE__ */ jsx(Tooltip, { contentStyle: { backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px" } }),
      /* @__PURE__ */ jsx(Legend, {}),
      /* @__PURE__ */ jsx(Bar, { dataKey: "productos", fill: "var(--primary)", radius: [8, 8, 0, 0], name: "Productos" })
    ] }) }) })
  ] });
}
export {
  ProductsSoldChart
};
