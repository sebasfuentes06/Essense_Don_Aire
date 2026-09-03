import { jsx, jsxs } from "react/jsx-runtime";
import { Moon, Sun } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { useTheme } from "../../../contexts/ThemeContext";
function Header() {
  const {
    theme,
    toggleTheme
  } = useTheme();
  const isDark = theme === "dark";
  return /* @__PURE__ */jsx("header", {
    className: "h-16 bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-card/80",
    children: /* @__PURE__ */jsxs("div", {
      className: "h-full px-4 sm:px-6 flex items-center justify-between gap-3",
      children: [/* @__PURE__ */jsx("div", {
        className: "min-w-0 flex-1 max-w-md",
        children: /* @__PURE__ */jsx(SearchBar, {})
      }), /* @__PURE__ */jsxs("div", {
        className: "flex items-center gap-2",
        children: [/* @__PURE__ */jsx("button", {
          className: "h-10 w-10 rounded-xl hover:bg-muted transition-colors flex items-center justify-center",
          onClick: toggleTheme,
          children: isDark ? /* @__PURE__ */jsx(Sun, {
            className: "h-5 w-5 text-foreground"
          }) : /* @__PURE__ */jsx(Moon, {
            className: "h-5 w-5 text-foreground"
          })
        }), /* @__PURE__ */jsx(NotificationsDropdown, {})]
      })]
    })
  });
}
export { Header };