import { jsx, jsxs } from "react/jsx-runtime";
import { useReports } from "../../hooks/reports";
import { ReportsHeader, SummaryCards, SalesTrendChart, ProductsSoldChart, CategoryPieChart, TopSellersList, CategoryDetailsTable } from "../../components/reports";
function Reports() {
  const {
    period,
    handlePeriodChange,
    periodOptions,
    summaryCards,
    salesByMonth,
    salesByCategory,
    topSellers,
    COLORS
  } = useReports();
  return /* @__PURE__ */jsxs("div", {
    className: "space-y-6",
    children: [/* @__PURE__ */jsx(ReportsHeader, {
      period,
      onPeriodChange: handlePeriodChange,
      periodOptions
    }), /* @__PURE__ */jsx(SummaryCards, {
      cards: summaryCards
    }), /* @__PURE__ */jsxs("div", {
      className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4",
      children: [/* @__PURE__ */jsx(SalesTrendChart, {
        data: salesByMonth
      }), /* @__PURE__ */jsx(ProductsSoldChart, {
        data: salesByMonth
      }), /* @__PURE__ */jsx(CategoryPieChart, {
        data: salesByCategory,
        colors: COLORS
      }), /* @__PURE__ */jsx(TopSellersList, {
        sellers: topSellers
      })]
    }), /* @__PURE__ */jsx(CategoryDetailsTable, {
      categories: salesByCategory
    })]
  });
}
export { Reports };