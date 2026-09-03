import { jsx } from "react/jsx-runtime";
import { StatCard } from "../../../../shared/components/dashboard/StatCard";
function DashboardStats({
  stats
}) {
  return /* @__PURE__ */jsx("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6",
    children: stats.map(stat => /* @__PURE__ */jsx(StatCard, {
      title: stat.title,
      value: stat.value,
      change: stat.change,
      changeType: stat.changeType,
      icon: stat.icon,
      iconColor: stat.iconColor
    }, stat.title))
  });
}
export { DashboardStats };