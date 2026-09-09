import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./Features/App.jsx";
import "./shared/styles/index.css";
import "./shared/styles/tailwind.css";
import "./shared/styles/globals.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
