import { jsx, jsxs } from "react/jsx-runtime";
import { useDashboard } from "../../hooks/dashboard";
import { DashboardHeader, DashboardStats, SalesTrendChart, OrdersChart, TopProductsList, LowStockAlert } from "../../components/dashboard";
function Dashboard() {
  const {
    stats,
    salesData,
    topProducts,
    lowStockProducts
  } = useDashboard();
  return /* @__PURE__ */jsxs("div", {
    className: "space-y-6",
    children: [/* @__PURE__ */jsx(DashboardHeader, {}), /* @__PURE__ */jsx(DashboardStats, {
      stats
    }), /* @__PURE__ */jsxs("div", {
      className: "grid grid-cols-1 xl:grid-cols-2 gap-6",
      children: [/* @__PURE__ */jsx(SalesTrendChart, {
        data: salesData
      }), /* @__PURE__ */jsx(OrdersChart, {
        data: salesData
      })]
    }), /* @__PURE__ */jsxs("div", {
      className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
      children: [/* @__PURE__ */jsx(TopProductsList, {
        products: topProducts
      }), /* @__PURE__ */jsx(LowStockAlert, {
        products: lowStockProducts
      })]
    })]
  });
}
export { Dashboard };