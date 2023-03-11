import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { catchNetError } from "@bff-sdk/web/catchError";

// ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

ReactDOM.hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

catchNetError((err) => {
  console.log("捕获到错误:", err.httpCode);
}, "focus");
