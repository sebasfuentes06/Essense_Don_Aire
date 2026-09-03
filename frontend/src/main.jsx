import { jsx } from "react/jsx-runtime";
import { createRoot } from "react-dom/client";
import App from "./Features/App.jsx";
import "./shared/styles/index.css";
import "./shared/styles/tailwind.css";
import "./shared/styles/globals.css";
createRoot(document.getElementById("root")).render(/* @__PURE__ */ jsx(App, {}));
